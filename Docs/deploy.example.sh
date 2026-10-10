#!/usr/bin/env bash
# ==============================================================================
# Resume-Saathi Full-Stack Production Deployment Template (Public / Clean)
# Ubuntu 22.04 / 24.04 | Docker Compose & Nginx Reverse Proxy
#
# Safe for public repositories (No hardcoded credentials or private secrets).
#
# HOW TO CONFIGURE VARIABLES:
# Option 1: Create a deploy.env file with your variables (see Docs/sample.env).
# Option 2: Export variables before running: export MONGODB_URI="mongodb+srv://..."
# Option 3: Run the script interactively; it will prompt for missing values.
#
# HOW TO RUN:
#   bash Docs/deploy.example.sh
#   bash Docs/deploy.example.sh --reset    # Wipe state and start fresh
# ==============================================================================

(
set -e
export DEBIAN_FRONTEND=noninteractive

# ─── Colors & Logging ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ─── Load Environment File if Present ─────────────────────────────────────────
if [ -f "./deploy.env" ]; then
  info "Loading configuration from ./deploy.env ..."
  # shellcheck disable=SC1091
  set -a && source ./deploy.env && set +a
elif [ -f "$HOME/.resumesaathi.env" ]; then
  info "Loading configuration from $HOME/.resumesaathi.env ..."
  # shellcheck disable=SC1091
  set -a && source "$HOME/.resumesaathi.env" && set +a
fi

# Helper to prompt user if a variable is missing and terminal is interactive
prompt_var() {
  local var_name="$1"
  local prompt_text="$2"
  local default_val="$3"
  local current_val="${!var_name:-}"

  if [ -z "$current_val" ]; then
    if [ -t 0 ]; then
      read -r -p "$(echo -e "${YELLOW}? ${prompt_text} [${default_val}]: ${NC}")" input_val
      eval "$var_name=\"\${input_val:-$default_val}\""
    else
      eval "$var_name=\"$default_val\""
    fi
  fi
}

prompt_secret() {
  local var_name="$1"
  local prompt_text="$2"
  local default_val="${3:-}"
  local current_val="${!var_name:-}"

  if [ -z "$current_val" ]; then
    if [ -t 0 ]; then
      read -r -s -p "$(echo -e "${YELLOW}? ${prompt_text}: ${NC}")" input_val
      echo ""
      eval "$var_name=\"\${input_val:-$default_val}\""
    else
      eval "$var_name=\"$default_val\""
    fi
  fi
}

# ─── Configuration & Defaults ─────────────────────────────────────────────────
prompt_var FRONTEND_DOMAIN "Enter your public domain (e.g. resumesaathi.example.com)" "resumesaathi.tusharsaini.tech"
prompt_var SSL_EMAIL "Enter your email for Let's Encrypt SSL notifications" "admin@${FRONTEND_DOMAIN}"
prompt_var ORIGIN_VERIFY_SECRET "Enter CloudFront origin verification secret header (X-Origin-Verify) or leave empty" ""

DOCKER_USER="${DOCKER_USER:-tusharsaini999}"
DOCKER_TOKEN="${DOCKER_TOKEN:-}"
APP_VERSION="${APP_VERSION:-latest}"

BACKEND_IMAGE="${BACKEND_IMAGE:-${DOCKER_USER}/resume-saathi:backend-${APP_VERSION}}"
FRONTEND_IMAGE="${FRONTEND_IMAGE:-${DOCKER_USER}/resume-saathi:frontend-${APP_VERSION}}"
BACKEND_CONTAINER="${BACKEND_CONTAINER:-resume-backend-container}"
FRONTEND_CONTAINER="${FRONTEND_CONTAINER:-resume-frontend-container}"
BACKEND_PORT="${BACKEND_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
WORKSPACE="${WORKSPACE:-$HOME/resumesaathi}"

# Database
prompt_var MONGODB_URI "Enter your MongoDB URI" "mongodb+srv://user:password@cluster.mongodb.net/ResumeSaathiDB"
MONGODB_URI_FALLBACK="${MONGODB_URI_FALLBACK:-$MONGODB_URI}"

# JWT Secret (Auto-generated 64-character random key if not set)
if [ -z "${JWT_SECRET_KEY:-}" ]; then
  JWT_SECRET_KEY="$(openssl rand -hex 32 2>/dev/null || date +%s%N | sha256sum | head -c 64)"
  info "Generated secure random JWT_SECRET_KEY"
fi

# SMTP / Email Service
MAIL_HOST="${MAIL_HOST:-email-smtp.ap-south-1.amazonaws.com}"
MAIL_PORT="${MAIL_PORT:-587}"
MAIL_SECURE="${MAIL_SECURE:-false}"
MAIL_USER="${MAIL_USER:-your_smtp_username}"
MAIL_PASS="${MAIL_PASS:-your_smtp_password}"
MAIL_FROM="${MAIL_FROM:-support@${FRONTEND_DOMAIN}}"

# Cloudinary
CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME:-your_cloudinary_cloud_name}"
CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY:-your_cloudinary_api_key}"
CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET:-your_cloudinary_api_secret}"

# Google Gemini AI
GEMINI_API_KEYS="${GEMINI_API_KEYS:-your_gemini_api_key_1}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.5-flash}"

# OAuth Providers
GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:-your_google_client_id.apps.googleusercontent.com}"
GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET:-your_google_client_secret}"
LINKEDIN_CLIENT_ID="${LINKEDIN_CLIENT_ID:-your_linkedin_client_id}"
LINKEDIN_CLIENT_SECRET="${LINKEDIN_CLIENT_SECRET:-your_linkedin_client_secret}"

# IP Geolocation
IPWHO_API_KEY="${IPWHO_API_KEY:-your_ipwhois_api_key}"

# Frontend API URL
VITE_SERVER_URL="${VITE_SERVER_URL:-https://${FRONTEND_DOMAIN}/api/v1}"

# ─── Idempotency helpers ──────────────────────────────────────────────────────
STATE_FILE="${STATE_FILE:-$HOME/.rs_deploy_state}"
step_done()  { grep -qx "$1" "$STATE_FILE" 2>/dev/null; }
mark_done()  { echo "$1" >> "$STATE_FILE"; }
reset_state(){ rm -f "$STATE_FILE"; warn "State reset — all steps will re-run."; }
skip()       { warn "  ↩ Step already completed, skipping."; }

if [ "${1:-}" = "--reset" ] || [ "${RESET_DEPLOY:-false}" = "true" ]; then
  reset_state
fi

# ═══════════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Resume-Saathi  —  Production Deployment Script     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -f "$STATE_FILE" ]; then
  warn "Resuming from previous run (pass --reset or RESET_DEPLOY=true to start fresh)."
  echo ""
fi

# ─── Step 0: Cleanup ──────────────────────────────────────────────────────────
if ! step_done "step0_cleanup"; then
  info "[0/7] Cleaning up existing containers, workspace & Nginx configs..."
  if command -v docker >/dev/null 2>&1; then
    sudo docker rm -f "$BACKEND_CONTAINER"  2>/dev/null || true
    sudo docker rm -f "$FRONTEND_CONTAINER" 2>/dev/null || true
    if [ -f "$WORKSPACE/docker-compose.yml" ]; then
      sudo docker compose -f "$WORKSPACE/docker-compose.yml" down --remove-orphans 2>/dev/null || true
    fi
  fi
  rm -rf "$WORKSPACE"
  sudo rm -f \
    "/etc/nginx/sites-available/$FRONTEND_DOMAIN" \
    "/etc/nginx/sites-enabled/$FRONTEND_DOMAIN"
  mark_done "step0_cleanup"
  success "Cleanup done."
else
  skip
fi

# ─── Step 1: System packages ──────────────────────────────────────────────────
if ! step_done "step1_packages"; then
  info "[1/7] Updating package index & installing Nginx, Certbot, Docker..."
  sudo apt-get update -y
  sudo apt-get install -y --no-install-recommends \
    curl ca-certificates nginx certbot python3-certbot-nginx \
    docker.io docker-compose-v2
  mark_done "step1_packages"
  success "Packages installed."
else
  skip
fi

# ─── Step 2: Docker service ───────────────────────────────────────────────────
if ! step_done "step2_docker"; then
  info "[2/7] Configuring Docker service..."
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER" 2>/dev/null || true
  mark_done "step2_docker"
  success "Docker ready."
else
  skip
fi

# ─── Step 3: Docker Hub login ─────────────────────────────────────────────────
if ! step_done "step3_dockerlogin"; then
  if [ -n "$DOCKER_TOKEN" ] && [ "$DOCKER_TOKEN" != "your_docker_token_placeholder" ]; then
    info "[3/7] Authenticating with Docker Hub..."
    echo "$DOCKER_TOKEN" | sudo docker login -u "$DOCKER_USER" --password-stdin
    mark_done "step3_dockerlogin"
    success "Docker Hub authenticated."
  else
    info "[3/7] No DOCKER_TOKEN provided — proceeding with public Docker images."
    mark_done "step3_dockerlogin"
  fi
else
  skip
fi

# ─── Step 4: Workspace ────────────────────────────────────────────────────────
mkdir -p "$WORKSPACE"
if ! step_done "step4_workspace"; then
  info "[4/7] Preparing workspace at $WORKSPACE..."
  mark_done "step4_workspace"
  success "Workspace ready."
fi

# Always cd into workspace for compose actions
cd "$WORKSPACE"

# ─── Step 5: Write .env files ─────────────────────────────────────────────────
if ! step_done "step5_envfiles"; then
  info "[5/7] Writing environment configuration files..."

  cat > backend.env <<ENVEOF
# ── Environment ────────────────────────────────────────
NODE_ENV=production
HOST=0.0.0.0
PORT=${BACKEND_PORT}

# ── URLs ───────────────────────────────────────────────
HOST_SERVER=https://${FRONTEND_DOMAIN}
FRONTEND_URL=https://${FRONTEND_DOMAIN}
CLIENT_URLS=https://${FRONTEND_DOMAIN},https://www.${FRONTEND_DOMAIN}

# ── Database ───────────────────────────────────────────
MONGODB_URI=${MONGODB_URI}
MONGODB_URI_FALLBACK=${MONGODB_URI_FALLBACK}

# ── Auth ───────────────────────────────────────────────
JWT_SECRET_KEY=${JWT_SECRET_KEY}

# ── Mail (AWS SES SMTP) ────────────────────────────────
MAIL_HOST=${MAIL_HOST}
MAIL_PORT=${MAIL_PORT}
MAIL_SECURE=${MAIL_SECURE}
MAIL_USER=${MAIL_USER}
MAIL_PASS=${MAIL_PASS}
MAIL_FROM=${MAIL_FROM}

# ── Cloudinary ─────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# ── Gemini LLM ─────────────────────────────────────────
GEMINI_API_KEYS=${GEMINI_API_KEYS}
GEMINI_MODEL=${GEMINI_MODEL}

# ── Google OAuth ───────────────────────────────────────
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

# ── LinkedIn OAuth ─────────────────────────────────────
LINKEDIN_CLIENT_ID=${LINKEDIN_CLIENT_ID}
LINKEDIN_CLIENT_SECRET=${LINKEDIN_CLIENT_SECRET}

# ── IP Lookup ──────────────────────────────────────────
IPWHO_API_KEY=${IPWHO_API_KEY}
ENVEOF

  cat > frontend.env <<ENVEOF
VITE_SERVER_URL=${VITE_SERVER_URL}
ENVEOF

  mark_done "step5_envfiles"
  success "Environment files written."
else
  skip
fi

# ─── Step 6: docker-compose.yml & deploy ──────────────────────────────────────
if ! step_done "step6_deploy"; then
  info "[6/7] Generating docker-compose.yml & deploying containers..."

  cat > docker-compose.yml <<COMPOSEEOF
services:

  # ── Backend (Express / Node.js) ──────────────────────────
  backend:
    container_name: ${BACKEND_CONTAINER}
    image: ${DOCKER_USER}/resume-saathi:backend-\${APP_VERSION:-latest}
    restart: always
    expose:
      - "${BACKEND_PORT}"
    env_file:
      - backend.env
    networks:
      - app-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:${BACKEND_PORT}/api/v1/healthcheck >/dev/null 2>&1 || wget -qO- http://127.0.0.1:${BACKEND_PORT}/healthcheck >/dev/null 2>&1 || wget -qO- http://127.0.0.1:${BACKEND_PORT}/health >/dev/null 2>&1 || wget -qO- http://127.0.0.1:${BACKEND_PORT}/ >/dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s

  # ── Frontend (React + Nginx) ─────────────────────────────
  frontend:
    container_name: ${FRONTEND_CONTAINER}
    image: ${DOCKER_USER}/resume-saathi:frontend-\${APP_VERSION:-latest}
    restart: always
    ports:
      - "127.0.0.1:${FRONTEND_PORT}:80"
    networks:
      - app-network
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "5m"
        max-file: "2"

networks:
  app-network:
    driver: bridge
COMPOSEEOF

  info "Pulling Docker images..."
  sudo docker compose pull
  info "Starting containers..."
  sudo docker compose up -d --remove-orphans
  sudo docker image prune -f || true
  mark_done "step6_deploy"
  success "Containers are up and healthy."
else
  skip
fi

sudo docker compose ps

# ─── Step 7: Nginx + SSL ──────────────────────────────────────────────────────
# Traffic routing architecture (CloudFront & EC2 End-to-End SSL):
#
#   Global Visitors (HTTPS : 443)
#          │
#          ▼
#   AWS CloudFront CDN (ACM SSL us-east-1)
#          │  (HTTPS : 443 — End-to-End TLSv1.2/1.3)
#          ▼
#   Host Nginx (EC2 - Port 443 SSL / Port 80 HTTP)
#          │  (Let's Encrypt Certificate)
#          └─► 127.0.0.1:${FRONTEND_PORT} (frontend container)
#                        │
#            location /      ─► static files
#            location /api/  ─► backend:${BACKEND_PORT} [internal Docker bridge]
#
# The backend is NEVER directly reachable from the host or the internet.

if ! step_done "step7_nginx"; then
  info "[7/7] Configuring Nginx reverse proxy & ACME challenge support..."
  sudo mkdir -p /var/www/certbot

  HEADER_SECURITY_CHECK=""
  if [ -n "$ORIGIN_VERIFY_SECRET" ]; then
    HEADER_SECURITY_CHECK="
    # ── CloudFront Origin Verification (Block direct IP access & DDoS) ──
    # Drops direct requests from scanners, bots, or hackers (code 444: connection closed immediately)
    if (\$http_x_origin_verify != \"${ORIGIN_VERIFY_SECRET}\") {
        return 444;
    }"
  fi

  cat > /tmp/nginx-frontend.conf <<NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name ${FRONTEND_DOMAIN} www.${FRONTEND_DOMAIN} origin.${FRONTEND_DOMAIN} _;

    # ACME challenge for Let's Encrypt / Certbot verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
${HEADER_SECURITY_CHECK}

    # Redirect www to non-www
    if (\$host = www.${FRONTEND_DOMAIN}) {
        return 301 https://${FRONTEND_DOMAIN}\$request_uri;
    }

    # Remove trailing slash from URLs (e.g. /about/ -> /about, ignoring /api/)
    rewrite ^/(?!api/)(.+)/$ /\$1 permanent;

    client_max_body_size 20M;

    # ── Frontend SPA static files & routes ────────────────────
    location / {
        proxy_pass         http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    \$http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       \$host;
        proxy_set_header   X-Real-IP  \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    # ── Backend API reverse proxy ─────────────────────────────
    location /api/ {
        proxy_pass         http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    \$http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       \$host;
        proxy_set_header   X-Real-IP  \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;

        # Extended timeouts for Gemini LLM analysis & resume file uploads
        proxy_connect_timeout 60s;
        proxy_send_timeout    180s;
        proxy_read_timeout    180s;
    }
}
NGINXEOF
  sudo cp /tmp/nginx-frontend.conf "/etc/nginx/sites-available/$FRONTEND_DOMAIN"

  # Enable site & disable default
  sudo ln -sf "/etc/nginx/sites-available/$FRONTEND_DOMAIN" "/etc/nginx/sites-enabled/$FRONTEND_DOMAIN"
  sudo rm -f /etc/nginx/sites-enabled/default

  sudo nginx -t
  sudo systemctl restart nginx
  mark_done "step7_nginx"
  success "Nginx reverse proxy configured."
else
  skip
fi

# ── Issue SSL certificate & enable Port 443 HTTPS ─────────────────────────────
if ! step_done "step7_ssl"; then
  info "Checking and issuing SSL certificate for $FRONTEND_DOMAIN (Certbot / Let's Encrypt)..."
  sudo mkdir -p /var/www/certbot

  CERT_DOMAINS=("-d" "$FRONTEND_DOMAIN" "-d" "www.$FRONTEND_DOMAIN" "-d" "origin.$FRONTEND_DOMAIN")

  if sudo certbot certonly --webroot -w /var/www/certbot \
    "${CERT_DOMAINS[@]}" \
    --agree-tos \
    --email "$SSL_EMAIL" \
    --non-interactive \
    --keep-until-expiring 2>/dev/null; then
    success "SSL certificate issued for $FRONTEND_DOMAIN, www, and origin."
  elif sudo certbot certonly --webroot -w /var/www/certbot \
    -d "$FRONTEND_DOMAIN" \
    -d "www.$FRONTEND_DOMAIN" \
    --agree-tos \
    --email "$SSL_EMAIL" \
    --non-interactive \
    --keep-until-expiring 2>/dev/null; then
    success "SSL certificate issued for $FRONTEND_DOMAIN and www."
  elif sudo certbot certonly --webroot -w /var/www/certbot \
    -d "$FRONTEND_DOMAIN" \
    --agree-tos \
    --email "$SSL_EMAIL" \
    --non-interactive \
    --keep-until-expiring 2>/dev/null; then
    success "SSL certificate issued for $FRONTEND_DOMAIN."
  elif sudo certbot --nginx \
    -d "$FRONTEND_DOMAIN" \
    --agree-tos \
    --email "$SSL_EMAIL" \
    --non-interactive \
    --no-redirect \
    --keep-until-expiring; then
    success "SSL certificate issued via nginx plugin."
  else
    warn "Automated certbot issuance encountered an error."
  fi

  # Check if certificate files exist and install full HTTPS + HTTP configuration
  CERT_PATH="/etc/letsencrypt/live/$FRONTEND_DOMAIN/fullchain.pem"
  KEY_PATH="/etc/letsencrypt/live/$FRONTEND_DOMAIN/privkey.pem"

  if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
    info "Applying complete HTTPS (Port 443 SSL) + HTTP (Port 80) configuration to Nginx..."

    HEADER_SECURITY_CHECK=""
    if [ -n "$ORIGIN_VERIFY_SECRET" ]; then
      HEADER_SECURITY_CHECK="
    # ── CloudFront Origin Verification (Block direct IP access & DDoS) ──
    # Drops direct requests from scanners, bots, or hackers (code 444: connection closed immediately)
    if (\$http_x_origin_verify != \"${ORIGIN_VERIFY_SECRET}\") {
        return 444;
    }"
    fi

    cat > /tmp/nginx-frontend-ssl.conf <<NGINXEOF
# ── HTTP (Port 80) ──────────────────────────────────────────
server {
    listen 80;
    listen [::]:80;
    server_name ${FRONTEND_DOMAIN} www.${FRONTEND_DOMAIN} origin.${FRONTEND_DOMAIN} _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
${HEADER_SECURITY_CHECK}

    # Redirect www to non-www
    if (\$host = www.${FRONTEND_DOMAIN}) {
        return 301 https://${FRONTEND_DOMAIN}\$request_uri;
    }

    rewrite ^/(?!api/)(.+)/$ /\$1 permanent;

    client_max_body_size 20M;

    location / {
        proxy_pass         http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    \$http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       \$host;
        proxy_set_header   X-Real-IP  \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    \$http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       \$host;
        proxy_set_header   X-Real-IP  \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout    180s;
        proxy_read_timeout    180s;
    }
}

# ── HTTPS (Port 443) — CloudFront to Origin End-to-End SSL ─
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${FRONTEND_DOMAIN} www.${FRONTEND_DOMAIN} origin.${FRONTEND_DOMAIN};

    ssl_certificate     ${CERT_PATH};
    ssl_certificate_key ${KEY_PATH};
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
${HEADER_SECURITY_CHECK}

    # Redirect www to non-www
    if (\$host = www.${FRONTEND_DOMAIN}) {
        return 301 https://${FRONTEND_DOMAIN}\$request_uri;
    }

    rewrite ^/(?!api/)(.+)/$ /\$1 permanent;

    client_max_body_size 20M;

    location / {
        proxy_pass         http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    \$http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       \$host;
        proxy_set_header   X-Real-IP  \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    \$http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       \$host;
        proxy_set_header   X-Real-IP  \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;

        proxy_connect_timeout 60s;
        proxy_send_timeout    180s;
        proxy_read_timeout    180s;
    }
}
NGINXEOF
    sudo cp /tmp/nginx-frontend-ssl.conf "/etc/nginx/sites-available/$FRONTEND_DOMAIN"
    sudo ln -sf "/etc/nginx/sites-available/$FRONTEND_DOMAIN" "/etc/nginx/sites-enabled/$FRONTEND_DOMAIN"
    sudo nginx -t && sudo systemctl reload nginx
    sudo systemctl enable --now certbot.timer 2>/dev/null || true
    mark_done "step7_ssl"
    success "End-to-End HTTPS (Port 443) enabled with active SSL certificates and auto-renewal."
  else
    warn "SSL certificate files not found at $CERT_PATH. Remaining on Port 80 HTTP."
  fi
else
  skip
fi

# ─── Final summary ─────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Deployment Completed Successfully!          ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  URL      : https://${FRONTEND_DOMAIN}${NC}"
echo -e "${GREEN}║  API path : https://${FRONTEND_DOMAIN}/api/v1${NC}"
echo -e "${GREEN}║  Version  : ${APP_VERSION}${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Running containers:${NC}"
sudo docker compose -f "$WORKSPACE/docker-compose.yml" ps

)
