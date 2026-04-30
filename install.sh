#!/usr/bin/env bash
# =============================================================================
# ThiDomV2 - Bootstrap d'installation initiale (Linux)
#
# Installe TOUS les pre-requis systeme manquants puis lance le deploiement :
#   - python3, python3-venv, pip
#   - apache2 (+ modules), openssl
#   - curl, unzip, jq, rsync
#   - docker + docker compose (mode docker)
#   - mariadb-server   <-- installation auto, mot de passe demande
#
# Usage :
#   sudo ./install.sh                      # interactif, mode no-docker, MariaDB
#   sudo ./install.sh --mode docker        # deploiement via docker compose
#   sudo ./install.sh --db sqlite          # garde SQLite (pas d'install MariaDB)
#   sudo ./install.sh --noninteractive     # utilise les variables d'env :
#                                          #   DB_PASSWORD, DB_NAME, DB_USER
#
# Idempotent : reexecutable sans risque, ne reinstalle pas ce qui est present.
# =============================================================================
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# ---------- Defaults ----------
MODE="no-docker"            # no-docker | docker
DB_ENGINE="mariadb"         # mariadb  | sqlite
INTERACTIVE=true
WITH_DUMP=false             # n'importe le dump SQL que si --with-dump
DB_NAME="${DB_NAME:-thidomv2}"
DB_USER="${DB_USER:-thidom}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_ROOT_PASSWORD="${DB_ROOT_PASSWORD:-}"

ENV_FILE="$ROOT_DIR/backend/.env"
SQL_DUMP="$ROOT_DIR/backend/thidomv2_mysql_dump.sql"

while [ $# -gt 0 ]; do
  case "$1" in
    --mode)            MODE="$2"; shift 2 ;;
    --db)              DB_ENGINE="$2"; shift 2 ;;
    --noninteractive)  INTERACTIVE=false; shift ;;
    --with-dump)       WITH_DUMP=true; shift ;;
    -h|--help)
      sed -n '2,22p' "$0"; exit 0 ;;
    *) echo "Option inconnue : $1"; exit 1 ;;
  esac
done

# ---------- Couleurs ----------
G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; C='\033[0;36m'; N='\033[0m'
log()  { echo -e "${G}[install]${N} $1"; }
warn() { echo -e "${Y}[install]${N} $1"; }
err()  { echo -e "${R}[install]${N} $1" >&2; }
ask()  { echo -e "${C}[install]${N} $1"; }

if [ "$EUID" -ne 0 ]; then
  err "Ce script doit etre execute avec sudo (acces root requis)."
  exit 1
fi

# ---------- Detection du gestionnaire de paquets ----------
detect_pm() {
  if   command -v apt-get >/dev/null;  then PM=apt
  elif command -v dnf     >/dev/null;  then PM=dnf
  elif command -v yum     >/dev/null;  then PM=yum
  elif command -v pacman  >/dev/null;  then PM=pacman
  elif command -v apk     >/dev/null;  then PM=apk
  else err "Distribution non supportee (apt/dnf/yum/pacman/apk introuvables)."; exit 1
  fi
  log "Gestionnaire de paquets detecte : $PM"
}

pm_install() {
  case "$PM" in
    apt)    DEBIAN_FRONTEND=noninteractive apt-get install -y "$@" ;;
    dnf)    dnf install -y "$@" ;;
    yum)    yum install -y "$@" ;;
    pacman) pacman -S --noconfirm --needed "$@" ;;
    apk)    apk add --no-cache "$@" ;;
  esac
}

pm_update() {
  case "$PM" in
    apt)    apt-get update -y ;;
    dnf|yum) ;; # auto
    pacman) pacman -Sy --noconfirm ;;
    apk)    apk update ;;
  esac
}

# Mapping nom -> paquet
pkg() {
  local what="$1"
  case "$what:$PM" in
    python:apt|python:apk)            echo "python3 python3-venv python3-pip" ;;
    python:dnf|python:yum)            echo "python3 python3-pip" ;;
    python:pacman)                    echo "python python-pip" ;;
    apache:apt)                       echo "apache2" ;;
    apache:dnf|apache:yum)            echo "httpd mod_ssl" ;;
    apache:pacman)                    echo "apache" ;;
    apache:apk)                       echo "apache2 apache2-ssl apache2-proxy" ;;
    mariadb:apt)                      echo "mariadb-server mariadb-client" ;;
    mariadb:dnf|mariadb:yum)          echo "mariadb-server mariadb" ;;
    mariadb:pacman)                   echo "mariadb" ;;
    mariadb:apk)                      echo "mariadb mariadb-client" ;;
    common:*)                         echo "curl unzip jq rsync openssl" ;;
  esac
}

# ---------- Etape 1 : pre-requis systeme ----------
detect_pm
log "Mise a jour de la liste des paquets..."
pm_update

log "Installation des outils communs..."
pm_install $(pkg common "")

log "Installation de Python..."
pm_install $(pkg python "")

log "Installation d'Apache..."
pm_install $(pkg apache "")

# Modules apache (Debian/Ubuntu)
if [ "$PM" = "apt" ] && command -v a2enmod >/dev/null; then
  a2enmod rewrite proxy proxy_http proxy_wstunnel ssl headers >/dev/null 2>&1 || true
fi

# ---------- Etape 2 : Docker (si demande) ----------
if [ "$MODE" = "docker" ]; then
  if ! command -v docker >/dev/null; then
    log "Installation de Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
  fi
  if ! docker compose version >/dev/null 2>&1; then
    pm_install docker-compose-plugin || pm_install docker-compose || true
  fi
fi

# ---------- Etape 3 : MariaDB ----------
if [ "$DB_ENGINE" = "mariadb" ]; then
  # Detection : MariaDB etait-il deja present AVANT cette execution ?
  MARIADB_WAS_PRESENT=false
  if command -v mysqld >/dev/null 2>&1 || command -v mariadbd >/dev/null 2>&1; then
    MARIADB_WAS_PRESENT=true
  fi

  log "Installation de MariaDB..."
  pm_install $(pkg mariadb "")

  # Detection du nom de service
  if   systemctl list-unit-files | grep -q '^mariadb\.service';  then DB_SVC=mariadb
  elif systemctl list-unit-files | grep -q '^mysqld\.service';   then DB_SVC=mysqld
  elif systemctl list-unit-files | grep -q '^mysql\.service';    then DB_SVC=mysql
  else DB_SVC=mariadb
  fi
  systemctl enable --now "$DB_SVC" || warn "Impossible de demarrer $DB_SVC automatiquement."

  # ----- Si MariaDB vient d'etre installe : configurer le mot de passe root -----
  if [ "$MARIADB_WAS_PRESENT" = false ]; then
    log "MariaDB nouvellement installe : configuration du compte root."
    if [ -z "$DB_ROOT_PASSWORD" ]; then
      if [ "$INTERACTIVE" = true ]; then
        ask "Choisissez le mot de passe pour le compte 'root' de MariaDB :"
        while true; do
          read -rsp "  Mot de passe root : " DB_ROOT_PASSWORD; echo
          read -rsp "  Confirmation     : " DB_ROOT_PASSWORD2; echo
          [ -n "$DB_ROOT_PASSWORD" ] && [ "$DB_ROOT_PASSWORD" = "$DB_ROOT_PASSWORD2" ] && break
          warn "Mots de passe vides ou differents, recommencez."
        done
      else
        err "DB_ROOT_PASSWORD non defini en mode non-interactif (MariaDB neuf)."; exit 1
      fi
    fi
    # Active l'authentification par mot de passe pour root@localhost
    # (par defaut sur Debian/Ubuntu : auth via socket unix_socket plugin)
    mysql --protocol=socket -uroot <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_ROOT_PASSWORD';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '$DB_ROOT_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SQL
    log "Compte root MariaDB configure."
  else
    log "MariaDB etait deja present : compte root inchange."
  fi

  # Mot de passe de l'utilisateur applicatif
  if [ -z "$DB_PASSWORD" ]; then
    if [ "$INTERACTIVE" = true ]; then
      ask "Choisissez le mot de passe pour l'utilisateur applicatif '$DB_USER' :"
      while true; do
        read -rsp "  Mot de passe : " DB_PASSWORD; echo
        read -rsp "  Confirmation : " DB_PASSWORD2; echo
        [ -n "$DB_PASSWORD" ] && [ "$DB_PASSWORD" = "$DB_PASSWORD2" ] && break
        warn "Mots de passe vides ou differents, recommencez."
      done
    else
      err "DB_PASSWORD non defini en mode non-interactif."; exit 1
    fi
  fi

  log "Creation de la base '$DB_NAME' et de l'utilisateur '$DB_USER'..."
  # On utilise socket auth root (par defaut sur Debian/Ubuntu/Arch)
  mysql --protocol=socket -uroot <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';
ALTER USER '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'$DB_HOST';
FLUSH PRIVILEGES;
SQL

  # Par defaut on n'importe PAS le dump SQL : la structure sera creee
  # automatiquement par le backend (init_default_admin.py / Base.metadata.create_all)
  # au premier demarrage. Le flag --with-dump permet d'importer les donnees de demo.
  if [ "$WITH_DUMP" = true ] && [ -f "$SQL_DUMP" ]; then
    TABLES=$(mysql --protocol=socket -uroot -N -e \
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME';")
    if [ "$TABLES" -eq 0 ]; then
      log "Import du dump $(basename "$SQL_DUMP")..."
      mysql --protocol=socket -uroot "$DB_NAME" < "$SQL_DUMP"
    else
      log "Base '$DB_NAME' deja peuplee ($TABLES tables) — import ignore."
    fi
  else
    log "Base '$DB_NAME' creee vide (la structure sera initialisee par le backend)."
  fi

  DATABASE_URL="mysql+aiomysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
else
  log "Mode SQLite : pas d'installation de SGBD."
  DATABASE_URL="sqlite+aiosqlite:///./data/thidomv2.db"
fi

# ---------- Etape 4 : ecriture du .env ----------
log "Mise a jour de $ENV_FILE..."
mkdir -p "$(dirname "$ENV_FILE")"
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$ENV_FILE.bak.$(date +%s)"
  # Met a jour DATABASE_URL en place ou l'ajoute
  if grep -q '^DATABASE_URL=' "$ENV_FILE"; then
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" "$ENV_FILE"
  else
    echo "DATABASE_URL=$DATABASE_URL" >> "$ENV_FILE"
  fi
else
  cat > "$ENV_FILE" <<EOF
# Genere par install.sh
DATABASE_URL=$DATABASE_URL
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
TIMEZONE=Europe/Paris
EOF
fi
chmod 600 "$ENV_FILE"

# ---------- Etape 5 : deploiement ----------
log "Pre-requis OK. Lancement du deploiement (mode=$MODE)..."
if [ "$MODE" = "docker" ]; then
  sudo -E bash "$ROOT_DIR/update.sh"
else
  chmod +x "$ROOT_DIR/update-no-docker.sh"
  sudo -E bash "$ROOT_DIR/update-no-docker.sh"
fi

# ---------- Etape 6 : initialisation de la base + admin par defaut ----------
# Cree la structure SQLAlchemy si manquante + un admin par defaut (admin/admin).
INIT_DIR=""
if   [ -x "${INSTALL_DIR:-/opt/thidomv2}/backend/venv/bin/python" ]; then
  INIT_DIR="${INSTALL_DIR:-/opt/thidomv2}/backend"
elif [ -x "$ROOT_DIR/backend/venv/bin/python" ]; then
  INIT_DIR="$ROOT_DIR/backend"
fi

if [ -n "$INIT_DIR" ]; then
  log "Initialisation de la base et creation de l'admin par defaut..."
  ( cd "$INIT_DIR" && "$INIT_DIR/venv/bin/python" init_default_admin.py ) || \
    warn "Initialisation echouee. Lancez manuellement : cd $INIT_DIR && venv/bin/python init_default_admin.py"
else
  warn "venv backend introuvable, etape d'init admin ignoree."
  warn "Lancez manuellement : cd backend && venv/bin/python init_default_admin.py"
fi

log "Installation terminee."
log "Connectez-vous avec : admin / admin (a changer immediatement)."
