# Resume-Saathi — Production Deployment & Operations Guide

Comprehensive technical documentation covering the production architecture, automated server setup, environment variables, CI/CD pipeline, and operational maintenance for **Resume-Saathi**.

---

## 1. System Architecture

The production environment is globally accelerated and secured via **AWS CloudFront CDN** and **AWS Certificate Manager (ACM)**, fronting an **AWS EC2 (Ubuntu 22.04 / 24.04)** instance running a containerized Docker Compose micro-service topology behind a host Nginx reverse proxy.

```
Global Users (Worldwide / Web Clients - Port 443)
       │
       ▼
 ┌────────────────────────────────────────────────────────┐
 │ AWS CloudFront CDN (Global Edge POPs e.g. DEL51)       │
 │  - Custom Domain: resumesaathi.tusharsaini.tech        │
 │  - SSL / TLS: AWS Certificate Manager (Auto-Renewing) │
 │  - AWS WAF: Rate Limiting & Bot Protection             │
 │  - SPA Fallback: 403 / 404 -> /index.html (200 OK)     │
 │  - Custom Origin Header: X-Origin-Verify: <SECRET>     │
 └───────┬──────────────────────────────────┬─────────────┘
         │ Default (*) - CachingOptimized   │ /api/* - CachingDisabled
         │ (Edge Cache HIT: JS, CSS, Media) │ (Dynamic Passthrough)
         │ HTTPS (Port 443 - TLSv1.2/1.3)   │ HTTPS (Port 443 - TLSv1.2/1.3)
         ▼                                  ▼
 ┌────────────────────────────────────────────────────────┐
 │ AWS EC2 Host Nginx Reverse Proxy (Ports 443 & 80)      │
 │  - Origin SSL: Let's Encrypt (Certbot TLSv1.2 / 1.3)   │
 │  - Origin Cloaking: Enforces X-Origin-Verify header   │
 │  - Drops direct IP/scanners immediately (HTTP 444)     │
 └───────┬──────────────────────────────────┬─────────────┘
         │ (proxy_pass: 127.0.0.1:3000)     │ (proxy_pass: /api/ -> 127.0.0.1:3000)
         ▼                                  ▼
 ┌─────────────────────────────┐    ┌──────────────────────────────────┐
 │ resume-frontend-container   │    │ resume-backend-container         │
 │ (React Vite SPA / Nginx)    │    │ (Node.js 20 Express REST API)    │
 │ Port: 127.0.0.1:3000 -> 80  │    │ Port: app-network:5000 (Internal)│
 └─────────────────────────────┘    └───────┬──────────────────────────┘
                                            │
                                            ▼
                           External TLS Managed Services
                           - MongoDB Atlas (Cluster)
                           - Cloudinary (Resume PDF storage)
                           - Google Gemini AI (LLM Analysis)
                           - AWS SES SMTP (Email Delivery)
```

---

## 2. Prerequisites & Server Preparation

Before running any deployment script, ensure your infrastructure meets the following baseline requirements:

### AWS Hardware Specifications & Sizing Analysis

The architecture has been benchmarked for low cost, stability, and zero-downtime resilience. Below is the hardware profile breakdown:

#### 1. EC2 Instance Type Selection

| Instance Type | vCPU | RAM | Cost (ap-south-1) | Suitability | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`t3.micro`** | 2 | 1.0 GB | ~$7.50 / mo (Free Tier) | ⚠️ Dev / Minimal | Risk of Out-of-Memory (OOM) during concurrent resume uploads or simultaneous Docker image extraction unless a 2GB swapfile is added. |
| **`t3.small`** | 2 | 2.0 GB | ~$15.00 / mo | ✅ **Recommended Production** | Sweet-spot for production. Ample memory headroom for Node.js, Nginx, Docker daemon, and SSM agent without memory pressure. |
| **`t3.medium`** | 2 | 4.0 GB | ~$30.00 / mo | 🚀 High Scale | Recommended when running local background jobs, Redis caching, or >100 concurrent active users. |

#### 2. RAM & Memory Allocation Breakdown (2.0 GB Baseline)

When running on `t3.small` (2.0 GB RAM), system memory is utilized as follows:

```
┌────────────────────────────────────────────────────────┐
│ Total Available RAM: 2048 MB                            │
├────────────────────────────┬───────────────────────────┤
│ Ubuntu 22.04 / 24.04 OS    │ ~180 MB                   │
│ AWS SSM Agent + Systemd    │ ~60 MB                    │
│ Host Nginx Reverse Proxy   │ ~25 MB                    │
│ Docker Engine + containerd │ ~120 MB                   │
│ Frontend Container (Nginx) │ ~20 MB                    │
│ Backend API (Node.js 20)   │ ~220 MB (idle) - 450 MB   │
│ OS File Cache & Free Head  │ ~900 MB - 1100 MB         │
└────────────────────────────┴───────────────────────────┘
```

> [!TIP]
> **Swap File Recommendation**: On both `t3.micro` and `t3.small`, always enable a 2 GB swapfile. This guarantees that temporary memory spikes during Docker pulls or PDF parsing never trigger the Linux Out-Of-Memory (OOM) killer:
> ```bash
> sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
> sudo mkswap /swapfile && sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

#### 3. Storage Architecture (Amazon EBS gp3)
- **Volume Type**: **`gp3` (General Purpose SSD)**.
- **Recommended Size**: **25 GB – 30 GB**.
- **Performance Baseline**: AWS `gp3` provides **3,000 baseline IOPS** and **125 MB/s throughput** for free included in the baseline cost (unlike older `gp2` which scaled with volume size).
- **Disk Utilization Estimation**:
  - Ubuntu Base OS & Kernel: ~4.5 GB
  - Installed Packages & Toolchains: ~2.0 GB
  - Docker Images (Frontend + Backend + Alpine base): ~3.5 GB
  - Application Logs & Temp Storage (Docker log rotation capped at 10MB x 3): ~1.0 GB
  - Unallocated Free Buffer: ~14.0 GB (sufficient for blue-green image caching)

#### 4. CPU Architecture & Bursting
- **Architecture**: `x86_64` (AMD64).
- **T3 Unlimited**: Enabled by default on AWS T3 instances. T3 provides burstable CPU capability using accrued CPU credits. During normal traffic, the server uses ~5–15% CPU, accruing credits. During deployments, Docker image extractions, or peak traffic, the instance bursts up to 100% of both vCPUs seamlessly.

#### 5. Networking & Elastic IP (EIP)
- **Network Performance**: Up to 5 Gbps burst.
- **Elastic IP (EIP)**: An Amazon Elastic IP **must** be allocated and associated with the EC2 instance. Without an Elastic IP, the public IP address changes whenever the instance is stopped or restarted, which would break your public DNS `A` records.

---

### Firewall & AWS Security Groups (Origin Cloaking Model)
Configure your AWS EC2 Security Group with these inbound rules:

| Type | Protocol | Port Range | Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **SSH** | TCP | `22` | Your IP / Bastion | Secure shell administration |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | Let's Encrypt ACME verification & HTTP-to-HTTPS redirect |
| **HTTPS** | TCP | `443` | `0.0.0.0/0` | Production SSL traffic protected by `X-Origin-Verify` secret |

> [!IMPORTANT]
> **Why 0.0.0.0/0 with Secret Header Cloaking?**
> AWS CloudFront Prefix Lists contain 55 IP rules, overflowing AWS Security Group limits when combined across ports 80 and 443. Furthermore, dynamic regional edge POPs (like DEL51 Delhi) connect to origins from edge ranges outside the prefix list unless paid Origin Shield is active.
> Opening Port 443 to `0.0.0.0/0` and enforcing `$http_x_origin_verify` inside Nginx (`return 444;`) provides superior security: direct IP scanners are killed immediately at the socket level without consuming compute resources, while all CloudFront edge requests pass through seamlessly.

> [!NOTE]
> Ports `3000` (Frontend) and `5000` (Backend) do **not** need to be opened in your AWS Security Group. They run strictly on the internal loopback interface (`127.0.0.1`) and Docker bridge network (`app-network`), fronted safely by host Nginx.

### DNS Records & Cloudflare Configuration
Add the following DNS `A` records in your DNS provider (e.g., Cloudflare, Route53, GoDaddy) pointing to your EC2 Elastic Public IP:

- `resumesaathi.yourdomain.com` ➔ `YOUR_EC2_PUBLIC_IP`
- `www.resumesaathi.yourdomain.com` ➔ `YOUR_EC2_PUBLIC_IP`

> [!IMPORTANT]
> **Cloudflare Sub-Subdomain SSL Rule**: Free Cloudflare Universal SSL does **not** cover multi-level subdomains (`www.resumesaathi.yourdomain.com`). Set the Cloudflare DNS Proxy status for `www.resumesaathi` to **DNS Only (Grey Cloud)**. This allows the host Nginx Let's Encrypt certificate on EC2 to perform the TLS handshake and issue the 301 redirect seamlessly.

---

## 3. Server Provisioning Scripts (`Docs/`)

The repository includes three deployment script variants designed for different execution workflows:

| Script | Audience | Interaction | Secrets Handling | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **`Docs/deploy.public.sh`** | Public / Teams | **Non-Interactive** (Zero prompts) | Loads from `deploy.env` or header defaults | Automated server boots, CI/CD, SSM, Cloud-Init |
| **`Docs/deploy.example.sh`** | Public / Teams | **Interactive Wizard** | Prompts for missing vars in terminal | First-time manual SSH deployments |
| **`Docs/deploy.sh`** | Owner / Live Server | **Non-Interactive** | Pre-populated with real production secrets | Live AWS EC2 instance (git-ignored) |

All scripts automate the 8-step server lifecycle with built-in idempotency tracking via `~/.rs_deploy_state`:

```
┌─────────┐   ┌──────────┐   ┌─────────┐   ┌──────────────┐
│ Step 0  │──►│  Step 1  │──►│ Step 2  │──►│    Step 3    │
│ Cleanup │   │ Packages │   │ Docker  │   │ Docker Login │
└─────────┘   └──────────┘   └─────────┘   └──────────────┘
                                                  │
┌─────────┐   ┌──────────┐   ┌─────────┐          ▼
│ Step 7  │◄──│  Step 6  │◄──│ Step 5  │◄──┌──────────────┐
│ Nginx & │   │ Docker   │   │ Write   │   │    Step 4    │
│   SSL   │   │ Compose  │   │ .env    │   │  Workspace   │
└─────────┘   └──────────┘   └─────────┘   └──────────────┘
```

---

## 4. How to Use the Deployment Scripts (Step-by-Step)

### Method 1: Using `deploy.public.sh` (Recommended for Automation & CI/CD)

This script is completely non-interactive — it **never stops to prompt the user** for keyboard input, preventing hung terminal sessions during automation.

#### Step 1: Connect to your Ubuntu Server
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 2: Clone or Download the Repository
```bash
git clone https://github.com/TusharSaini999/Resume-Saathi.git
cd Resume-Saathi
```

#### Step 3: Create your `deploy.env` Configuration File
Copy the public template to `deploy.env`:
```bash
cp Docs/sample.env deploy.env
```
Edit `deploy.env` with your actual domain and service keys:
```bash
nano deploy.env
```
*(Fill in `FRONTEND_DOMAIN`, `MONGODB_URI`, `MAIL_USER`, `MAIL_PASS`, `GEMINI_API_KEYS`, etc.)*

#### Step 4: Run the Deployment
```bash
bash Docs/deploy.public.sh
```

#### Step 5: (Optional) Supplying Variables via Shell Export
If you do not want to create a `deploy.env` file on disk, export the variables directly in your shell:
```bash
export FRONTEND_DOMAIN="resumesaathi.mycompany.com"
export MONGODB_URI="mongodb+srv://admin:pass@cluster.mongodb.net/ResumeSaathiDB"
export JWT_SECRET_KEY="$(openssl rand -hex 32)"

bash Docs/deploy.public.sh
```

#### Step 6: Forcing a Complete Reset & Re-run
If you want to wipe existing containers, workspace, and Nginx configurations to start 100% fresh from Step 0:
```bash
bash Docs/deploy.public.sh --reset
# OR
RESET_DEPLOY=true bash Docs/deploy.public.sh
```

---

### Method 2: Using `deploy.example.sh` (Interactive CLI Wizard)

If you prefer an interactive experience that guides you question-by-question through the setup:

#### Step 1: Run the Interactive Script
```bash
bash Docs/deploy.example.sh
```

#### Step 2: Answer the Prompts
The wizard will prompt you in sequence for any values not already defined:
1. **Public Domain**: `Enter your public domain [resumesaathi.tusharsaini.tech]:` *(Type your domain and hit Enter)*
2. **SSL Email**: `Enter your email for Let's Encrypt SSL notifications:` *(Type your notification email)*
3. **MongoDB URI**: `Enter your MongoDB URI:` *(Paste your connection string)*
4. **JWT Secret**: `Enter JWT Secret Key:` *(Hit Enter to auto-generate a secure random 64-character secret)*
5. **AWS SES SMTP**: `Enter SMTP Host`, `User`, and `Password`.
6. **Cloudinary**: `Enter Cloudinary Cloud Name`, `API Key`, and `API Secret`.
7. **Gemini AI**: `Enter Gemini API Keys` *(comma-separated for round-robin rotation)*.
8. **OAuth**: `Enter Google and LinkedIn Client IDs and Secrets`.

Once confirmed, the script proceeds automatically through Steps 0 to 7.

---

### Method 3: Using `deploy.sh` (Direct Private Production Execution)

On your private production server (where credentials are permanently maintained inside `Docs/deploy.sh`):

```bash
# Standard idempotent run (picks up where it left off)
bash Docs/deploy.sh

# Complete reset and re-deploy
bash Docs/deploy.sh --reset
```

---

## 5. Post-Deployment Verification & Testing

Once the script outputs `Deployment Completed Successfully!`, execute these verification commands to ensure the entire stack is operational:

### 1. Verify Docker Containers & Health Status
```bash
sudo docker compose -f /home/ubuntu/resumesaathi/docker-compose.yml ps
```
Both `resume-backend-container` and `resume-frontend-container` must display **`healthy`**:
```
NAME                        STATUS                    PORTS
resume-backend-container    Up 2 minutes (healthy)    5000/tcp
resume-frontend-container   Up 2 minutes (healthy)    127.0.0.1:3000->80/tcp
```

### 2. Verify Internal Backend Health Endpoint
```bash
curl -i http://127.0.0.1:5000/api/v1/healthcheck
```
Expected output:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"status":"healthy","uptime":120}
```

### 3. Verify Public HTTPS & Redirection Rules
Test each routing scenario from any machine:

```bash
# 1. Main Application Route (Must return HTTP 200)
curl -I https://resumesaathi.yourdomain.com

# 2. Subdomain WWW Redirection (Must return HTTP 301 to root domain)
curl -I https://www.resumesaathi.yourdomain.com

# 3. Trailing Slash Removal (Must return HTTP 301 stripping trailing slash)
curl -I https://resumesaathi.yourdomain.com/about/
```

### 4. Monitor Live Application Logs
```bash
# View backend application logs (Express & MongoDB connection)
sudo docker logs -f resume-backend-container --tail 100

# View frontend web server logs
sudo docker logs -f resume-frontend-container --tail 100
```

---

## 6. Troubleshooting & Common Pitfalls

### Problem 1: `resume-backend-container is unhealthy`
- **Cause A**: Node.js/Express binds to IPv4 loopback (`127.0.0.1`). If the healthcheck uses `localhost`, Alpine resolves to IPv6 (`::1`), which Express rejects.
  - **Resolution**: Always use `wget -qO- http://127.0.0.1:5000/api/v1/healthcheck` (already configured in our scripts).
- **Cause B**: MongoDB Atlas IP Whitelist block.
  - **Resolution**: Go to **MongoDB Atlas ➔ Security ➔ Network Access** and ensure your EC2 Elastic IP (or `0.0.0.0/0`) is whitelisted.

### Problem 2: Let's Encrypt SSL Generation Fails (`certbot`)
- **Cause A**: DNS records haven't propagated yet or ports 80/443 are blocked by AWS Security Group.
  - **Resolution**: Run `dig +short yourdomain.com` to verify IP resolution, and confirm AWS Security Group allows inbound port 80 and 443 from `0.0.0.0/0`.
- **Cause B**: Cloudflare Proxying `www.subdomain` on a free plan.
  - **Resolution**: Change `www` DNS record in Cloudflare to **DNS Only (Grey Cloud)**.

### Problem 3: AWS SSM CD Pipeline says `Instances not in a valid state`
- **Cause**: The EC2 instance does not have the AWS Systems Manager IAM Role attached.
  - **Resolution**:
    1. In AWS EC2 Console, select your instance ➔ **Actions ➔ Security ➔ Modify IAM role**.
    2. Attach a role with the policy `AmazonSSMManagedInstanceCore`.
    3. Restart SSM agent on EC2: `sudo systemctl restart snap.amazon-ssm-agent.amazon-ssm-agent.service`.

---

## 7. Environment Variables Reference

A public-safe template is available in `Docs/sample.env` and `Backend/.env.example`.

### Origin Cloaking & Host Proxy (`deploy.env`)

| Variable | Type / Default | Description |
| :--- | :--- | :--- |
| `ORIGIN_VERIFY_SECRET` | Secret String | Shared secret token passed in CloudFront `X-Origin-Verify` custom header. Nginx drops any request without this token with code `444`. **Must never contain `$` signs.** |

### Backend Service (`backend.env`)

| Variable | Type / Default | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Node runtime environment |
| `HOST` | `0.0.0.0` | Server interface binding |
| `PORT` | `5000` | Port Express listens on |
| `HOST_SERVER` | URL | Public URL for OAuth callback redirects |
| `FRONTEND_URL` | URL | Application client URL |
| `CLIENT_URLS` | Comma-separated URLs | Permitted CORS origins |
| `MONGODB_URI` | Connection String | Primary MongoDB Atlas connection string |
| `MONGODB_URI_FALLBACK`| Connection String | Secondary direct replica set connection string |
| `JWT_SECRET_KEY` | Secret String | HMAC-SHA256 signature key for JWT tokens |
| `MAIL_HOST` | Hostname | AWS SES SMTP host (`email-smtp.ap-south-1.amazonaws.com`) |
| `MAIL_PORT` | `587` | SMTP submission port |
| `MAIL_SECURE` | `false` | STARTTLS flag |
| `MAIL_USER` / `MAIL_PASS` | Secret Strings | AWS SES SMTP credentials |
| `MAIL_FROM` | Email Address | Sender identity (e.g. `support@resumesaathi.tusharsaini.tech`) |
| `CLOUDINARY_*` | Cloud Name, Key, Secret | Cloudinary storage credentials |
| `GEMINI_API_KEYS` | Comma-separated keys | Gemini API keys rotated across AI analysis requests |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` | Gemini model identifier |
| `GOOGLE_CLIENT_*` | Client ID / Secret | Google OAuth 2.0 Credentials |
| `LINKEDIN_CLIENT_*`| Client ID / Secret | LinkedIn OAuth 2.0 Credentials |
| `IPWHO_API_KEY` | Secret String | IP lookup geolocation API key |

### Frontend Service (`frontend.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_SERVER_URL` | `/api/v1` or full URL | API base URL routed through Nginx proxy |

### GitHub Actions Secrets

Configured under **Settings → Secrets and variables → Actions**:

- `DOCKER_USERNAME`: Docker Hub account username.
- `DOCKER_ACCESS_TOKEN`: Docker Hub Personal Access Token (PAT).
- `AWS_ACCESS_KEY_ID`: IAM user access key with SSM SendCommand permission.
- `AWS_SECRET_ACCESS_KEY`: IAM user secret access key.
- `AWS_REGION`: Region of your EC2 instance (e.g., `ap-south-1`).
- `AWS_INSTANCE_ID`: Target EC2 instance ID (e.g., `i-0123456789abcdef0`).

---

## 8. CI/CD Workflow (`.github/workflows/`) & AWS IAM Configuration

### Architecture Overview

The automated deployment pipeline connects GitHub Actions with your AWS EC2 instance using **AWS Systems Manager (SSM)**. This eliminates the need to expose port 22 (SSH) to the internet or store vulnerable SSH private keys inside GitHub Secrets.

Two distinct AWS IAM configurations are required:
1. **EC2 IAM Role (`ResumeSaathi-EC2-SSM-Role`)**: Enables the EC2 instance's background SSM Agent to register with AWS Systems Manager.
2. **GitHub Actions IAM Identity (`ResumeSaathi-GitHubActions-Deployer`)**: Grants GitHub Actions permissions to execute `ssm:SendCommand` against the target EC2 instance.

```
┌─────────────────────────┐                        ┌───────────────────────────────┐
│  GitHub Actions Runner  │                        │         AWS Account           │
├─────────────────────────┤                        ├───────────────────────────────┤
│ cd.yml                  │                        │ AWS Systems Manager (SSM)     │
│  - Authenticates via    │─── ssm:SendCommand ───►│  - Validates instance ID      │
│    AWS_ACCESS_KEY_ID    │                        │  - Dispatches run command     │
│  - Targets INSTANCE_ID  │                        └───────────────┬───────────────┘
└─────────────────────────┘                                        │
                                                            SSM Agent Polling
                                                                   │
                                                                   ▼
                                                   ┌───────────────────────────────┐
                                                   │     AWS EC2 Ubuntu Host       │
                                                   │  (EC2 IAM Profile: SSM-Role)  │
                                                   ├───────────────────────────────┤
                                                   │ - Pulls Docker images         │
                                                   │ - docker compose up -d        │
                                                   │ - Zero-downtime container swap│
                                                   └───────────────────────────────┘
```

---

### Step 1: Configure the EC2 Instance IAM Role

The EC2 instance needs an IAM Role with permission to communicate with the AWS SSM service.

1. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/) ➔ **Roles** ➔ **Create role**.
2. **Trusted entity type**: Select **AWS service**.
3. **Use case**: Select **EC2** ➔ Click **Next**.
4. **Permissions policies**: Search for and check:
   - `AmazonSSMManagedInstanceCore` (AWS managed policy)
5. **Role name**: Enter `ResumeSaathi-EC2-SSM-Role` ➔ Click **Create role**.
6. **Attach Role to EC2**:
   - Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2/) ➔ **Instances**.
   - Select your Resume-Saathi instance.
   - Click **Actions ➔ Security ➔ Modify IAM role**.
   - Select `ResumeSaathi-EC2-SSM-Role` and click **Update IAM role**.
7. **Verify SSM Agent on EC2**:
   SSH into your EC2 instance and restart the SSM agent to register immediately:
   ```bash
   sudo systemctl restart snap.amazon-ssm-agent.amazon-ssm-agent.service
   sudo systemctl status snap.amazon-ssm-agent.amazon-ssm-agent.service
   ```

---

### Step 2: Configure the GitHub Actions IAM User & Policy

Create a dedicated IAM user with the principle of least privilege, allowing only SSM commands to your specific EC2 instance:

#### A. Create the IAM Policy
1. Open the **AWS IAM Console** ➔ **Policies** ➔ **Create policy**.
2. Select the **JSON** tab and paste the following policy (replace `YOUR_AWS_REGION`, `YOUR_ACCOUNT_ID`, and `YOUR_INSTANCE_ID` or use wildcards):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSSMRunShellScriptOnInstance",
      "Effect": "Allow",
      "Action": [
        "ssm:SendCommand"
      ],
      "Resource": [
        "arn:aws:ssm:*:*:document/AWS-RunShellScript",
        "arn:aws:ec2:*:*:instance/*"
      ]
    },
    {
      "Sid": "AllowSSMCommandStatusCheck",
      "Effect": "Allow",
      "Action": [
        "ssm:GetCommandInvocation",
        "ssm:ListCommandInvocations",
        "ssm:ListCommands",
        "ssm:DescribeInstanceInformation"
      ],
      "Resource": "*"
    }
  ]
}
```

3. Click **Next**, name the policy `ResumeSaathi-GitHubActions-SSM-Policy`, and click **Create policy**.

#### B. Create the IAM User & Access Keys
1. In IAM Console, navigate to **Users** ➔ **Create user**.
2. **User name**: `ResumeSaathi-GitHubActions-Deployer`.
3. Do **not** check "Provide user access to the AWS Management Console" (programmatic access only).
4. Click **Next** ➔ Select **Attach policies directly**.
5. Search for `ResumeSaathi-GitHubActions-SSM-Policy` and check it ➔ Click **Next** ➔ **Create user**.
6. Click on the newly created user `ResumeSaathi-GitHubActions-Deployer`.
7. Go to the **Security credentials** tab ➔ Scroll to **Access keys** ➔ Click **Create access key**.
8. Select **Application running outside AWS** ➔ Click **Next** ➔ **Create access key**.
9. **Copy both `Access key ID` and `Secret access key`**.

---

### Step 3: Add Secrets to GitHub Repository

1. Open your GitHub Repository ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions**.
2. Under **Repository secrets**, click **New repository secret** and add:

| Secret Name | Value Example | Description |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | `AKIAIOSFODNN7EXAMPLE` | Access key ID from Step 2 |
| `AWS_SECRET_ACCESS_KEY` | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | Secret access key from Step 2 |
| `AWS_REGION` | `ap-south-1` | AWS Region of your EC2 instance |
| `AWS_INSTANCE_ID` | `i-0123456789abcdef0` | EC2 Instance ID from EC2 Console |
| `DOCKER_USERNAME` | `tusharsaini999` | Docker Hub username |
| `DOCKER_ACCESS_TOKEN` | `dckr_pat_...` | Docker Hub Personal Access Token |

---

### Step 4: Pipeline Execution Details

#### Continuous Integration (`ci.yml`)
- Triggers on every push and pull request to `main`.
- Validates semantic version syntax in `version.json`.
- Runs `npm run lint` and `npm run build` on Frontend.
- Installs and verifies Backend dependencies.

#### Continuous Deployment (`cd.yml`)
- Triggers on pushes to `main` when `version.json` is bumped.
- Waits for `ci.yml` to succeed.
- Pushes Docker tags (`:backend-latest`, `:backend-vX.Y.Z`, `:frontend-latest`, `:frontend-vX.Y.Z`).
- Dispatches SSM command to EC2 which executes:
  ```bash
  cd /home/ubuntu/resumesaathi
  export APP_VERSION=vX.Y.Z
  sudo docker compose pull
  sudo docker compose up -d --remove-orphans
  sudo docker image prune -f
  ```

---

## 9. Operations & Day-to-Day Maintenance

```bash
# View running containers and health status
sudo docker compose -f /home/ubuntu/resumesaathi/docker-compose.yml ps

# View live container logs
sudo docker logs -f resume-backend-container --tail 100
sudo docker logs -f resume-frontend-container --tail 100

# Restart application stack
cd /home/ubuntu/resumesaathi && sudo docker compose restart

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Invalidate CloudFront edge cache (after new frontend release)
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

---

## 10. AWS CloudFront CDN & ACM SSL Architecture

Resume-Saathi utilizes **AWS CloudFront** as an edge content delivery network fronting the EC2 origin server for global latency reduction, edge caching, and DDoS defense.

### 10.1 SSL/TLS Management via AWS Certificate Manager (ACM)

- **Region Requirement**: The public SSL certificate is provisioned in `us-east-1` (N. Virginia), as required by AWS for all CloudFront custom domain distributions.
- **Validation Method**: DNS Validation using Route 53 CNAME record (`_xxxxx.resumesaathi.tusharsaini.tech` -> `_xxxxx.acm-validations.aws.`).
- **Zero-Touch Auto-Renewal**: AWS automatically validates and renews the certificate 60 days before expiration without manual intervention, server restarts, or cron jobs.

### 10.2 Cache Behaviors & Route Precedence

CloudFront enforces route-based caching using strict rule precedence:

| Precedence | Path Pattern | Origin | Cache Policy | Origin Request Policy | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0 (Top)** | `/api/*` | EC2 Origin (Port 80) | `Managed-CachingDisabled` | `Managed-AllViewerExceptHostHeader` / `AllViewer` | Dynamic pass-through for auth, JWT, MongoDB operations, and Gemini LLM analysis. Prevents stale data and user cache collisions. |
| **1 (Default)** | `Default (*)` | EC2 Origin (Port 80) | `Managed-CachingOptimized` | None | Edge caching for React SPA assets (`.js`, `.css`, images, fonts). Achieves `Hit from cloudfront` at local edge PoPs (e.g., Delhi `DEL51`). |

### 10.3 Single Page Application (SPA) Error Responses

Because client-side routing is handled in the browser by `react-router-dom`, deep links and page refreshes (e.g., `/auth/login`, `/dashboard`) require custom error fallback rules:
- **HTTP 403 (Forbidden)** ➔ Response: `/index.html` (HTTP 200 OK)
- **HTTP 404 (Not Found)** ➔ Response: `/index.html` (HTTP 200 OK)

### 10.4 EC2 Security Group Lockdown (Network Isolation)

To prevent attackers from discovering the public EC2 IPv4 address and bypassing CloudFront's cache, WAF, and rate limiting:
1. In the EC2 Security Group inbound rules, remove `0.0.0.0/0` on Port 80.
2. Restrict HTTP (Port 80) traffic to the **AWS CloudFront Origin-Facing Managed Prefix List**:
   - `com.amazonaws.global.cloudfront.origin-facing` (`pl-58a04531`).
3. Port 22 (SSH) remains restricted to admin IPs.

### 10.5 Host Nginx Configuration & Redirect Loop Prevention

CloudFront connects to the EC2 origin over HTTP (Port 80) and handles SSL termination at the edge. To prevent infinite 301 redirect loops (`ERR_TOO_MANY_REDIRECTS`), host Nginx:
1. Listens on Port 80 with wildcard catch-all: `server_name resumesaathi.tusharsaini.tech www.resumesaathi.tusharsaini.tech _;`.
2. Serves requests directly to the local frontend container (`127.0.0.1:3000`) without issuing HTTP-to-HTTPS redirects at the host level (handled upstream by CloudFront viewer protocol policy).

---

## 11. Production Rollback Strategy & Version Management 🔄

Resume-Saathi features an automated, zero-rebuild rollback pipeline enabled by immutable versioned Docker images and AWS Systems Manager (SSM).

### 11.1 One-Click Rollback via GitHub Actions
A dedicated rollback workflow is available at `.github/workflows/rollback.yml`:

1. Go to the **Actions** tab in your GitHub repository.
2. Select **"Rollback Production Version 🔄"** from the left workflow sidebar.
3. Click the **"Run workflow"** button.
4. Input:
   - **Target Version**: Enter the desired version tag (e.g. `v1.0.1` or `1.0.1`).
   - **Reason**: Optional explanation for auditing (e.g. *"Critical bug in v1.0.2"*).
5. Click **"Run workflow"**.
6. The action dispatches an AWS Systems Manager (SSM) command to your EC2 instance. In under 30 seconds:
   - Sets `APP_VERSION=v1.0.1` in the deployment directory.
   - Executes `docker compose pull` to retrieve the pre-built, tested images (`backend-v1.0.1` and `frontend-v1.0.1`).
   - Restarts containers with zero rebuild delay via `docker compose up -d --remove-orphans`.
   - Prunes untagged images and outputs container health statuses.

### 11.2 How to Determine Which Version is Best to Rollback To

When a production incident occurs, follow this decision tree to pick the optimal target version:

```
Incident Occurs (e.g. on v1.0.2)
         │
         ▼
Did v1.0.2 introduce a breaking Database Migration?
  ├── YES ──► Check if DB schema rollback script is required first.
  └── NO  ──► Proceed directly to previous version:
                 │
                 ▼
          Check Git Tags / Docker Hub:
          Current:  v1.0.2 (Unhealthy)
          Previous: v1.0.1 (Healthy / Stable)
                 │
                 ▼
          Input "v1.0.1" into Rollback Workflow ➔ 30-Second Recovery
```

#### Evaluation Checklist:
1. **Immediate Predecessor Version (Rule of Least Change)**:
   - In 95% of cases, the **immediate prior stable version** (e.g. if current is `v1.0.2`, choose `v1.0.1`) is the safest choice because its state was proven stable immediately before the current release.
2. **Review Git History & Tags**:
   - Run `git tag -l -n` or view the GitHub **Releases / Tags** page to inspect the release notes and commit summaries for each version.
3. **Database Schema Compatibility**:
   - If the new version only added new fields/endpoints (additive changes), rollback is completely safe and risk-free.
   - If fields were renamed or removed in MongoDB, verify the previous version's Mongoose models can handle current documents.
4. **Pre-Built Docker Hub Images**:
   - Ensure the target version has published tags on Docker Hub:
     - `tusharsaini999/resume-saathi:backend-vX.Y.Z`
     - `tusharsaini999/resume-saathi:frontend-vX.Y.Z`
5. **Post-Rollback Health Verification**:
   - Verify server liveness at: `https://resumesaathi.tusharsaini.tech/api/v1/healthcheck`
   - Both backend and frontend return HTTP 200 OK.

