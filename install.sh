#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"; cd "$ROOT_DIR"
MODE="no-docker"; DB_ENGINE="mariadb"; INTERACTIVE=true; WITH_DUMP=false
DB_NAME="${DB_NAME:-thidom}"; DB_USER="${DB_USER:-thidom}"; DB_HOST="${DB_HOST:-localhost}"; DB_PORT="${DB_PORT:-3306}"
DB_PASSWORD="${DB_PASSWORD:-}"; DB_ROOT_PASSWORD="${DB_ROOT_PASSWORD:-}"
ENV_FILE="$ROOT_DIR/backend/.env"; SQL_DUMP="$ROOT_DIR/backend/thidomv2_mysql_dump.sql"
while [ $# -gt 0 ]; do case "$1" in --mode) MODE="$2"; shift 2;; --db) DB_ENGINE="$2"; shift 2;; --noninteractive) INTERACTIVE=false; shift;; --with-dump) WITH_DUMP=true; shift;; *) echo "Option inconnue: $1"; exit 1;; esac; done
G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; C='\033[0;36m'; N='\033[0m'
log()  { echo -e "${G}[install]${N} $1"; }; warn() { echo -e "${Y}[install]${N} $1"; }
err()  { echo -e "${R}[install]${N} $1" >&2; }; ask()  { echo -e "${C}[install]${N} $1"; }
[ "$EUID" -ne 0 ] && { err "Lancez avec sudo."; exit 1; }
detect_pm() { if command -v apt-get >/dev/null; then PM=apt; elif command -v dnf >/dev/null; then PM=dnf; elif command -v yum >/dev/null; then PM=yum; elif command -v pacman >/dev/null; then PM=pacman; elif command -v apk >/dev/null; then PM=apk; else err "Non supporte"; exit 1; fi; log "PM=$PM"; }
pm_install() { case "$PM" in apt) DEBIAN_FRONTEND=noninteractive apt-get install -y "$@";; dnf) dnf install -y "$@";; yum) yum install -y "$@";; pacman) pacman -S --noconfirm --needed "$@";; apk) apk add --no-cache "$@";; esac; }
pm_update() { case "$PM" in apt) apt-get update -y;; pacman) pacman -Sy --noconfirm;; apk) apk update;; esac; }
pkg() { case "$1:$PM" in python:apt|python:apk) echo "python3 python3-venv python3-pip python3-dev";; python:dnf|python:yum) echo "python3 python3-pip python3-devel";; python:pacman) echo "python python-pip";; apache:apt) echo "apache2";; apache:dnf|apache:yum) echo "httpd mod_ssl";; apache:pacman) echo "apache";; apache:apk) echo "apache2 apache2-ssl apache2-proxy";; mariadb:apt) echo "mariadb-server mariadb-client";; mariadb:dnf|mariadb:yum) echo "mariadb-server mariadb";; mariadb:pacman) echo "mariadb";; mariadb:apk) echo "mariadb mariadb-client";; build:apt) echo "build-essential libffi-dev libssl-dev";; build:dnf|build:yum) echo "gcc gcc-c++ make libffi-devel openssl-devel";; build:pacman) echo "base-devel libffi openssl";; build:apk) echo "build-base libffi-dev openssl-dev";; common:*) echo "curl unzip jq rsync openssl";; esac; }
detect_pm; pm_update
log "Outils communs..."; pm_install $(pkg common)
log "Outils build..."; pm_install $(pkg build) || true
log "Python..."; pm_install $(pkg python)
log "Apache..."; pm_install $(pkg apache)
[ "$PM" = "apt" ] && command -v a2enmod >/dev/null && a2enmod rewrite proxy proxy_http proxy_wstunnel ssl headers >/dev/null 2>&1 || true
if [ "$MODE" = "docker" ]; then command -v docker >/dev/null || { curl -fsSL https://get.docker.com | sh; systemctl enable --now docker; }; docker compose version >/dev/null 2>&1 || pm_install docker-compose-plugin || true; fi
if [ "$DB_ENGINE" = "mariadb" ]; then
  MARIADB_WAS_PRESENT=false; command -v mysqld >/dev/null 2>&1 || command -v mariadbd >/dev/null 2>&1 && MARIADB_WAS_PRESENT=true
  log "MariaDB..."; pm_install $(pkg mariadb)
  if systemctl list-unit-files | grep -q '^mariadb\.service'; then DB_SVC=mariadb; elif systemctl list-unit-files | grep -q '^mysqld\.service'; then DB_SVC=mysqld; elif systemctl list-unit-files | grep -q '^mysql\.service'; then DB_SVC=mysql; else DB_SVC=mariadb; fi
  systemctl enable --now "$DB_SVC" || true
  if [ "$MARIADB_WAS_PRESENT" = false ]; then
    if [ -z "$DB_ROOT_PASSWORD" ]; then
      if [ "$INTERACTIVE" = true ]; then ask "Mot de passe root MariaDB :"; while true; do read -rsp "  MdP: " DB_ROOT_PASSWORD; echo; read -rsp "  Confirm: " DB_ROOT_PASSWORD2; echo; [ -n "$DB_ROOT_PASSWORD" ] && [ "$DB_ROOT_PASSWORD" = "$DB_ROOT_PASSWORD2" ] && break; done; else err "DB_ROOT_PASSWORD requis."; exit 1; fi; fi
    mysql --protocol=socket -uroot <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_ROOT_PASSWORD';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '$DB_ROOT_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION; FLUSH PRIVILEGES;
SQL
  else
    log "MariaDB deja present."
    if [ -z "$DB_ROOT_PASSWORD" ] && [ "$INTERACTIVE" = true ]; then
      if mysql --protocol=socket -uroot -e "SELECT 1" >/dev/null 2>&1; then log "Socket auth OK."; else ask "Mot de passe root existant :"; read -rsp "  " DB_ROOT_PASSWORD; echo; fi; fi
  fi
  [ -n "$DB_ROOT_PASSWORD" ] && MYSQL_ROOT="mysql -uroot -p${DB_ROOT_PASSWORD}" || MYSQL_ROOT="mysql --protocol=socket -uroot"
  $MYSQL_ROOT -e "SELECT 1" >/dev/null 2>&1 || { err "Connexion root impossible."; exit 1; }
  if [ -z "$DB_PASSWORD" ]; then
    if [ "$INTERACTIVE" = true ]; then ask "Mot de passe utilisateur '$DB_USER' :"; while true; do read -rsp "  MdP: " DB_PASSWORD; echo; read -rsp "  Confirm: " DB_PASSWORD2; echo; [ -n "$DB_PASSWORD" ] && [ "$DB_PASSWORD" = "$DB_PASSWORD2" ] && break; done; else err "DB_PASSWORD requis."; exit 1; fi; fi
  log "Creation base '$DB_NAME'..."
  $MYSQL_ROOT <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';
ALTER USER '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'$DB_HOST'; FLUSH PRIVILEGES;
SQL
  if [ "$WITH_DUMP" = true ] && [ -f "$SQL_DUMP" ]; then TABLES=$($MYSQL_ROOT -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME';"); [ "$TABLES" -eq 0 ] && $MYSQL_ROOT "$DB_NAME" < "$SQL_DUMP" || log "Base deja peuplee."; fi
  DATABASE_URL="mysql+aiomysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
else
  log "Mode SQLite."; DATABASE_URL="sqlite+aiosqlite:///./data/thidom.db"
fi
log "Ecriture .env..."
mkdir -p "$(dirname "$ENV_FILE")"
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$ENV_FILE.bak.$(date +%s)"
  grep -q '^DATABASE_URL=' "$ENV_FILE" && sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" "$ENV_FILE" || echo "DATABASE_URL=$DATABASE_URL" >> "$ENV_FILE"
else
  cat > "$ENV_FILE" <<EOF
DATABASE_URL=$DATABASE_URL
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
TIMEZONE=Europe/Paris
EOF
fi
# Remplacer la SECRET_KEY par defaut par une vraie cle aleatoire
if grep -q 'thidom-secret-key-change-in-production' "$ENV_FILE"; then
  NEW_KEY=$(openssl rand -hex 32)
  sed -i "s|thidom-secret-key-change-in-production|$NEW_KEY|" "$ENV_FILE"
  log "SECRET_KEY generee automatiquement."
fi
# Ajouter SECRET_KEY si absente
if ! grep -q '^SECRET_KEY=' "$ENV_FILE"; then
  echo "SECRET_KEY=$(openssl rand -hex 32)" >> "$ENV_FILE"
  log "SECRET_KEY ajoutee."
fi
# Remplacer les tokens par defaut restants
if grep -q 'thidom-influx-token' "$ENV_FILE"; then
  sed -i "s|thidom-influx-token|$(openssl rand -hex 16)|" "$ENV_FILE"
fi
chmod 600 "$ENV_FILE"

SVC_USER="${SVC_USER:-www-data}"; id "$SVC_USER" >/dev/null 2>&1 || SVC_USER="root"
SVC_INSTALL_DIR="${INSTALL_DIR:-/opt/thidom}"; SVC_NAME="${SERVICE_NAME:-thidom-backend}"; WEB_DIR="${WEB_DIR:-/var/www/ThiDom/browser}"

# Acces aux ports serie (USB/Zigbee/RF24/Z-Wave...)
if getent group dialout >/dev/null 2>&1; then
  sudo usermod -aG dialout "$SVC_USER" 2>/dev/null && log "$SVC_USER ajoute au groupe dialout (ports serie)."
fi

log "Deploiement (mode=$MODE)..."
if [ "$MODE" = "docker" ]; then sudo -E bash "$ROOT_DIR/update.sh"; else chmod +x "$ROOT_DIR/update-no-docker.sh"; sudo -E bash "$ROOT_DIR/update-no-docker.sh"; fi

DEPLOY_ENV="$SVC_INSTALL_DIR/backend/.env"
if [ "$ENV_FILE" != "$DEPLOY_ENV" ] && [ -f "$ENV_FILE" ]; then sudo mkdir -p "$(dirname "$DEPLOY_ENV")"; sudo cp "$ENV_FILE" "$DEPLOY_ENV"; sudo chmod 600 "$DEPLOY_ENV"; sudo chown "$SVC_USER:$SVC_USER" "$DEPLOY_ENV"; log ".env -> $DEPLOY_ENV"; fi

# ---- Permissions : tout le backend doit appartenir a SVC_USER ----
sudo chown -R "$SVC_USER:$SVC_USER" "$SVC_INSTALL_DIR/backend"
sudo chown -R www-data:www-data "$WEB_DIR" 2>/dev/null || true
log "Permissions corrigees ($SVC_USER)."

# ---- Apache config ----
if [ "$MODE" = "no-docker" ] && command -v a2enconf >/dev/null 2>&1; then
  APACHE_DEST="/etc/apache2/conf-available/ThiDom.conf"
  APACHE_SRC="$ROOT_DIR/frontend/apache.conf"
  if [ -f "$APACHE_SRC" ]; then
    log "Mise a jour config Apache depuis apache.conf..."
    sudo cp "$APACHE_SRC" "$APACHE_DEST"
  else
    log "Creation config Apache (inline)..."
    cat > "$APACHE_DEST" <<'APACHECONF'
# =============================================================================
# ThiDomV2 — Configuration Apache
# Modules requis :
#   sudo a2enmod rewrite proxy proxy_http proxy_wstunnel headers ssl
# =============================================================================

Alias /ThiDom /var/www/ThiDom/browser

<Directory /var/www/ThiDom/browser>
    Options -Indexes +FollowSymLinks
    AllowOverride None
    Require all granted
    RewriteEngine On
    RewriteBase /ThiDom/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /ThiDom/index.html [L]
</Directory>

# WebSocket proxy (doit etre AVANT le ProxyPass API)
RewriteEngine On
RewriteCond %{HTTP:Upgrade} =websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/ThiDom/api/ws/(.*) ws://localhost:8000/api/ws/$1 [P,L]

# API reverse proxy
ProxyPreserveHost On
ProxyPass        /ThiDom/api/ http://localhost:8000/api/
ProxyPassReverse /ThiDom/api/ http://localhost:8000/api/
APACHECONF
  fi
  log "Apache config installee."
  sudo a2enmod rewrite proxy proxy_http proxy_wstunnel ssl headers >/dev/null 2>&1 || true
  sudo a2enconf ThiDom >/dev/null 2>&1 || true
  # Injecter l'include ThiDom dans tous les vhosts SSL qui ne l'ont pas encore
  for ssl_conf in /etc/apache2/sites-enabled/*ssl*.conf /etc/apache2/sites-enabled/*le-ssl*.conf; do
    [ -f "$ssl_conf" ] || continue
    if ! grep -q 'Include conf-available/ThiDom.conf' "$ssl_conf"; then
      sudo sed -i '/<\/VirtualHost>/i Include conf-available/ThiDom.conf' "$ssl_conf"
      log "Include ThiDom ajoute dans $ssl_conf"
    fi
  done
  sudo apachectl configtest 2>&1 && { sudo systemctl reload apache2; log "Apache recharge."; } || warn "Erreur config Apache."
fi
# ---- systemd service ----
if [ "$MODE" = "no-docker" ] && command -v systemctl >/dev/null 2>&1; then
  SVC_FILE="/etc/systemd/system/${SVC_NAME}.service"
  if [ ! -f "$SVC_FILE" ]; then
    log "Creation service systemd '$SVC_NAME'..."
    DB_AFTER=""; [ "$DB_ENGINE" = "mariadb" ] && DB_AFTER=" ${DB_SVC:-mariadb}.service"
    sudo tee "$SVC_FILE" >/dev/null <<UNIT
[Unit]
Description=ThiDom backend (FastAPI/uvicorn)
After=network.target${DB_AFTER}
[Service]
Type=simple
User=$SVC_USER
WorkingDirectory=$SVC_INSTALL_DIR/backend
Environment="PATH=$SVC_INSTALL_DIR/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
EnvironmentFile=-$SVC_INSTALL_DIR/backend/.env
ExecStart=$SVC_INSTALL_DIR/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=on-failure
RestartSec=5
[Install]
WantedBy=multi-user.target
UNIT
    sudo systemctl daemon-reload; sudo systemctl enable "$SVC_NAME"
  else log "Service '$SVC_NAME' existe deja."; fi
  sudo systemctl restart "$SVC_NAME" || warn "Echec demarrage $SVC_NAME"
  sleep 2; sudo systemctl status --no-pager "$SVC_NAME" | head -n 8 || true

  SUDOERS_FILE="/etc/sudoers.d/thidom"; SCRIPT_ABS="$SVC_INSTALL_DIR/update-no-docker.sh"
  [ -f "$ROOT_DIR/update-no-docker.sh" ] && [ "$ROOT_DIR" != "$SVC_INSTALL_DIR" ] && sudo cp "$ROOT_DIR/update-no-docker.sh" "$SCRIPT_ABS" && sudo chmod +x "$SCRIPT_ABS"
  # Always (re)create sudoers so it stays in sync with the installed script path
  cat <<SUDOERS | sudo tee "$SUDOERS_FILE" >/dev/null
# ThiDom - allow the backend service user to run update & service commands
$SVC_USER ALL=(ALL) NOPASSWD: $SCRIPT_ABS
$SVC_USER ALL=(ALL) NOPASSWD: $SCRIPT_ABS *
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/systemd-run --scope --unit=thidom-update $SCRIPT_ABS
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/systemd-run --scope --unit=thidom-update $SCRIPT_ABS *
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/nohup $SCRIPT_ABS
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/nohup $SCRIPT_ABS *
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart $SVC_NAME
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload ${APACHE_SVC:-apache2}
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/tee $SVC_INSTALL_DIR/backend/update.log
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/tee $SVC_INSTALL_DIR/backend/update.status
$SVC_USER ALL=(ALL) NOPASSWD: /usr/bin/chown *
SUDOERS
  sudo chmod 440 "$SUDOERS_FILE"
  sudo visudo -c -f "$SUDOERS_FILE" >/dev/null 2>&1 || { warn "Sudoers invalide."; sudo rm -f "$SUDOERS_FILE"; }
  log "Sudoers configure ($SUDOERS_FILE)."

  # Pre-create update log/status files with correct ownership
  for f in "$SVC_INSTALL_DIR/backend/update.log" "$SVC_INSTALL_DIR/backend/update.status"; do
    sudo touch "$f"
    sudo chown "$SVC_USER:$SVC_USER" "$f"
  done
fi

# ---- init base + admin ----
INIT_DIR=""
[ -x "${INSTALL_DIR:-/opt/thidom}/backend/venv/bin/python" ] && INIT_DIR="${INSTALL_DIR:-/opt/thidom}/backend"
[ -z "$INIT_DIR" ] && [ -x "$ROOT_DIR/backend/venv/bin/python" ] && INIT_DIR="$ROOT_DIR/backend"
if [ -n "$INIT_DIR" ]; then
  log "Init base + admin..."; ( cd "$INIT_DIR" && "$INIT_DIR/venv/bin/python" init_default_admin.py ) || warn "Init echouee."
else warn "venv introuvable."; fi

log "Installation terminee."
log "Connectez-vous sur http://<IP>/ThiDom/ avec : admin / admin"