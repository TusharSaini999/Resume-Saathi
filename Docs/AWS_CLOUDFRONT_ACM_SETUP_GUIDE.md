# AWS CloudFront CDN & ACM SSL Integration Guide (Zero to Production)

A complete, end-to-end technical guide for configuring **AWS CloudFront CDN**, **AWS Certificate Manager (ACM)**, **Route 53 DNS**, and **EC2 Security Lockdown** for the **Resume-Saathi** production stack.

---

## 1. Architecture Overview

```
Global Visitors (HTTPS : 443)
       │
       ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ AWS CloudFront CDN (Global Edge POPs e.g. DEL51 Delhi)                 │
 │  - Custom Domains: resumesaathi.tusharsaini.tech & www.               │
 │  - SSL / TLS: AWS Certificate Manager (ACM us-east-1, Auto-Renewing)   │
 │  - AWS WAF: Common vulnerability & DDoS rate limiting                 │
 │  - SPA Fallback: 403 & 404 errors -> /index.html (HTTP 200 OK)        │
 └──────────────┬─────────────────────────────────────────┬───────────────┘
                │ Precedence 1: Default (*)               │ Precedence 0: /api/*
                │ Cache Policy: CachingOptimized          │ Cache Policy: CachingDisabled
                │ (Serves JS, CSS, Media from Edge Cache) │ (Direct Dynamic Passthrough)
                │ HTTPS (Port 443 - TLSv1.2/1.3)          │ HTTPS (Port 443 - TLSv1.2/1.3)
                ▼                                         ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ AWS EC2 Origin Server (Ubuntu 22.04 / 24.04 - Port 443 SSL & Port 80) │
 │  - Origin SSL: Let's Encrypt (Certbot Auto-Renewing TLSv1.2 / TLSv1.3) │
 │  - Security Group: Restricted to CloudFront Origin Prefix List         │
 │  - Host Nginx: Listens on Port 443 (SSL) and Port 80 (ACME Challenge)  │
 └──────────────────────────────┬─────────────────────────────────────────┘
                                │ (proxy_pass: 127.0.0.1:3000)
                                ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ Docker Microservice Architecture                                       │
 │  - Frontend Container: React Vite SPA (Port 127.0.0.1:3000 -> 80)     │
 │  - Backend Container:  Node.js Express REST API (Internal app-network) │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Implementation (Zero to Production)

### Step 1: Request SSL Certificate in AWS ACM (`us-east-1`)
> [!IMPORTANT]
> CloudFront requires custom SSL certificates to be created exclusively in the **`us-east-1` (N. Virginia)** region, regardless of where your EC2 instance is hosted.

1. Open **AWS Certificate Manager (ACM)** in the AWS Management Console.
2. Switch region to **US East (N. Virginia) `us-east-1`** in the top navigation bar.
3. Click **Request Certificate** ➔ Choose **Request a public certificate**.
4. In **Fully qualified domain name**, enter:
   * Primary: `resumesaathi.tusharsaini.tech`
   * Alternate: `www.resumesaathi.tusharsaini.tech` (or `*.tusharsaini.tech`)
5. Validation method: Select **DNS validation**.
6. Key algorithm: Select **RSA 2048**.
7. Click **Request**.

---

### Step 2: Validate Domain Ownership (DNS Auto-Renewal)

1. In ACM, click into the certificate you just requested (Status: *Pending validation*).
2. Under the **Domains** section, click the **Create records in Route 53** button.
   *(If your DNS is managed externally in Cloudflare or GoDaddy, copy the CNAME Name and CNAME Value into your DNS dashboard)*.
3. Confirm record creation.
4. Wait 2–5 minutes until the certificate status updates to **Issued** with a green badge.
   * **Renewal status**: `Success` / `Eligible`
   * *Note: As long as this CNAME record stays in your DNS, AWS will automatically renew the certificate 60 days before expiration with zero manual intervention.*

---

### Step 3: Configure EC2 Host Nginx with Let's Encrypt SSL (Port 443 & Port 80)

To support **End-to-End HTTPS** from CloudFront to EC2, your origin must present a valid SSL certificate trusted by a public Certificate Authority (Let's Encrypt). CloudFront will reject self-signed certificates.

SSH into your EC2 instance and run this single command to issue the certificate and enable HTTPS:

```bash
# 1. Install Certbot
sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx

# 2. Configure webroot challenge directory
sudo mkdir -p /var/www/certbot

# 3. Create initial Nginx configuration for ACME verification
sudo tee /etc/nginx/sites-available/resumesaathi.tusharsaini.tech << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name resumesaathi.tusharsaini.tech www.resumesaathi.tusharsaini.tech origin.resumesaathi.tusharsaini.tech _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    client_max_body_size 20M;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_set_header   Connection       "upgrade";
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_set_header   Connection       "upgrade";
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout    180s;
        proxy_read_timeout    180s;
    }
}
NGINXEOF
sudo ln -sf /etc/nginx/sites-available/resumesaathi.tusharsaini.tech /etc/nginx/sites-enabled/resumesaathi.tusharsaini.tech
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 4. Issue Let's Encrypt certificate
sudo certbot certonly --webroot -w /var/www/certbot \
  -d resumesaathi.tusharsaini.tech \
  -d www.resumesaathi.tusharsaini.tech \
  -d origin.resumesaathi.tusharsaini.tech \
  --agree-tos --email tusharsaini.in@gmail.com --non-interactive --keep-until-expiring || \
sudo certbot certonly --webroot -w /var/www/certbot \
  -d resumesaathi.tusharsaini.tech \
  --agree-tos --email tusharsaini.in@gmail.com --non-interactive --keep-until-expiring

# 5. Apply full HTTPS (Port 443 SSL) + HTTP (Port 80) configuration
sudo tee /etc/nginx/sites-available/resumesaathi.tusharsaini.tech << 'NGINXEOF'
# HTTP (Port 80) - ACME challenge & proxy fallback
server {
    listen 80;
    listen [::]:80;
    server_name resumesaathi.tusharsaini.tech www.resumesaathi.tusharsaini.tech origin.resumesaathi.tusharsaini.tech _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    client_max_body_size 20M;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_set_header   Connection       "upgrade";
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_set_header   Connection       "upgrade";
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout    180s;
        proxy_read_timeout    180s;
    }
}

# HTTPS (Port 443) - End-to-End SSL for CloudFront Origin
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name resumesaathi.tusharsaini.tech www.resumesaathi.tusharsaini.tech origin.resumesaathi.tusharsaini.tech;

    ssl_certificate     /etc/letsencrypt/live/resumesaathi.tusharsaini.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/resumesaathi.tusharsaini.tech/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 20M;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_set_header   Connection       "upgrade";
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_set_header   Connection       "upgrade";
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;

        proxy_connect_timeout 60s;
        proxy_send_timeout    180s;
        proxy_read_timeout    180s;
    }
}
NGINXEOF
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl enable --now certbot.timer
```

---

### Step 4: Create CloudFront Distribution (HTTPS Origin)

1. Open **CloudFront** in AWS Console ➔ Click **Create distribution** (or edit existing distribution).
2. **Distribution Type**: Select **Single website configuration**.
3. **Origin Settings**:
   * **Origin type**: Select **Other**.
   * **Origin domain**: Enter `origin.resumesaathi.tusharsaini.tech` *(or your EC2 public DNS / domain matching the SSL certificate)*.
   * **Protocol**: Select **HTTPS only** (Port: `443`).
   * **Minimum origin SSL protocol**: Select **`TLSv1.2`**.
   * **Response timeout**: Change from `30` to **`60`** (ensures Gemini AI resume analysis completes without 504 timeouts).
4. **Default Cache Behavior**:
   * **Viewer protocol policy**: Select **Redirect HTTP to HTTPS**.
   * **Allowed HTTP methods**: Select **GET, HEAD, OPTIONS**.
   * **Cache policy**: Select **`Managed-CachingOptimized`**.
5. **Web Application Firewall (WAF)**:
   * Keep **Included security protections** enabled.
   * Enable **Rate limiting** (protects from HTTP flood / DoS).
6. **Settings (Custom Domains & SSL)**:
   * **Alternate domain names (CNAME)**: Add:
     * `resumesaathi.tusharsaini.tech`
     * `www.resumesaathi.tusharsaini.tech`
   * **Custom SSL certificate**: Select the ACM certificate created in Step 1.
   * **Default root object**: Enter `index.html`.
7. Click **Create distribution** (or **Save changes**).

---

### Step 5: Add Backend API Cache Bypass (`/api/*`)

API routes handle authentication tokens, user sessions, and AI analysis. They must **never** be cached.

1. In your CloudFront distribution, navigate to the **Behaviors** tab.
2. Click **Create behavior**.
3. Set the following:
   * **Path pattern**: `/api/*`
   * **Origin**: Select your EC2 Origin.
   * **Viewer protocol policy**: **Redirect HTTP to HTTPS**.
   * **Allowed HTTP methods**: Select **`GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`**.
   * **Cache policy**: Select **`Managed-CachingDisabled`**.
   * **Origin request policy**: Select **`Managed-AllViewerExceptHostHeader`** (or `AllViewer`).
4. Click **Create behavior**.
5. Verify precedence list:
   * `0`: `/api/*` (CachingDisabled)
   * `1`: `Default (*)` (CachingOptimized)

---

### Step 6: Fix React Router SPA Error Pages (403/404 Fallback)

In single-page applications, reloading sub-paths (like `/auth/login` or `/dashboard`) returns 404 or 403 from the origin web server unless rerouted to `index.html`.

1. In your CloudFront distribution, navigate to the **Error pages** tab.
2. Click **Create custom error response**:
   * **HTTP error code**: `403: Forbidden`
   * **Customize error response**: `Yes`
   * **Response page path**: `/index.html`
   * **HTTP response code**: `200: OK`
3. Click **Create custom error response** again:
   * **HTTP error code**: `404: Not Found`
   * **Customize error response**: `Yes`
   * **Response page path**: `/index.html`
   * **HTTP response code**: `200: OK`

---

### Step 7: Route 53 DNS Configuration

1. Open **Route 53** ➔ **Hosted zones** ➔ Click `tusharsaini.tech`.
2. Create / Edit the following records:

| Record Name | Type | Alias | Target / Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `resumesaathi` | `A` | **ON** | Alias to CloudFront distribution (`dxxxxx.cloudfront.net`) | User traffic enters CloudFront Edge |
| `resumesaathi` | `AAAA` | **ON** | Alias to CloudFront distribution (`dxxxxx.cloudfront.net`) | IPv6 edge routing |
| `www.resumesaathi` | `A` | **ON** | Alias to CloudFront distribution (`dxxxxx.cloudfront.net`) | User traffic enters CloudFront Edge |
| `origin.resumesaathi` | `A` | **OFF** | EC2 Elastic Public IP (e.g. `13.233.154.129`) | Dedicated Origin domain for CloudFront HTTPS |

---

### Step 8: Origin Cloaking & DDoS Protection (Secret Header Lockdown)

Prevent attackers and bots from discovering your EC2 public IP and bypassing CloudFront's CDN, WAF, and DDoS mitigation.

#### 1. In CloudFront Console (Add Secret Header):
1. Open **CloudFront Console** ➔ Distributions ➔ Click distribution ➔ **Origins** tab ➔ **Edit**.
2. Scroll to **Add custom header**:
   * **Header name**: `X-Origin-Verify`
   * **Value**: `<YOUR_SECRET_TOKEN>` (e.g. `73r-p6xPG-K-c3-kjOx-SecureToken2026`)
3. Click **Save changes**.

> [!WARNING]
> **CRITICAL SYNTAX RULE: NEVER USE `$` IN THE SECRET TOKEN**
> In Linux Bash and Nginx configs, `$` is reserved for variable expansion. If a token contains `$`, Bash or Nginx will evaluate `$word` as an empty variable, truncating your secret and resulting in false mismatches with `502 Bad Gateway` or `444` errors. Always use alphanumeric characters, dashes, and underscores.

#### 2. In EC2 Security Group:
* **HTTPS (Port 443)**: `0.0.0.0/0` (Anywhere-IPv4)
* **HTTP (Port 80)**: `0.0.0.0/0` (Anywhere-IPv4)
* **SSH (Port 22)**: Restricted to your personal admin IP (`My IP`)
*(Using 0.0.0.0/0 prevents rule quota overflow and ensures all dynamic CloudFront edge POPs can reach your server without 504 timeouts).*

#### 3. In EC2 Host Nginx (Enforce Secret Header):
Add the verification check to immediately terminate any direct connection that lacks the secret header:

```nginx
# Drop direct requests from scanners, bots, or hackers (code 444: connection closed immediately)
if ($http_x_origin_verify != "<YOUR_SECRET_TOKEN>") {
    return 444;
}
```

* **Direct Visitors (`https://13.233.154.129`)**: Instantly dropped with **0 bytes** sent and **0% CPU** (Code `444`).
* **CloudFront Requests**: Passed through with valid header and served with **`200 OK`**.

---

## 3. Verification & Live Testing

### 1. Test Static Asset Edge Caching (Cache HIT)
```bash
curl -I https://resumesaathi.tusharsaini.tech/assets/index-DiIeYATK.js
```
Expected response:
```http
HTTP/1.1 200 OK
X-Cache: Hit from cloudfront
Via: 1.1 ... (CloudFront)
X-Amz-Cf-Pop: DEL51-P6
```

### 2. Test Dynamic Backend API (Cache Bypass)
```bash
curl -i https://resumesaathi.tusharsaini.tech/api/v1/healthcheck
```
Expected response:
```http
HTTP/1.1 200 OK
X-Cache: Miss from cloudfront
Via: 1.1 ... (CloudFront)
X-Amz-Cf-Pop: DEL51-P6
Content-Type: application/json; charset=utf-8

{"status":"ok","time":"..."}
```

### 3. Test Direct IP Attack / Bypass Drop (HTTP 444 Socket Kill)
```bash
curl -k -i https://13.233.154.129/api/v1/healthcheck
```
Expected response:
```
curl: (56) schannel: server closed abruptly (missing close_notify)
```
*(Connection closed immediately by Nginx code 444 before reading request body or executing backend code).*

---

## 4. Cache Invalidation Workflow (CI/CD)

Whenever you build and deploy a new version of the frontend, purge the edge cache so users receive the latest JavaScript and CSS immediately:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

