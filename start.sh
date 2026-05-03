#!/usr/bin/env bash
# =============================================================================
# ThiDomV2 - Script de demarrage complet (Backend + Frontend)
# Usage: ./start.sh [--deploy] [--https] [--build] [--install]
# =============================================================================
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
DEPLOY_DIR="/var/www/ThiDom/browser"

USE_HTTPS=false
DO_BUILD=false
DO_DEPLOY=false
DO_INSTALL=false

for arg in "$@"; do
  case $arg in
    --https)   USE_HTTPS=true ;;
    --build)   DO_BUILD=true ;;
    --deploy)  DO_DEPLOY=true ;;
    --install) DO_INSTALL=true ;;
    --help|-h)
      echo "Usage: ./start.sh [--deploy] [--https] [--build] [--install]"
      echo ""
      echo "  --deploy   Build + copie vers Apache + reload (PRODUCTION)"
      echo "  --build    Build de production uniquement"
      echo "  --https    Lancer le frontend en HTTPS via ng serve (DEV)"
      echo "  --install  Installer les dependances avant de lancer"
      echo ""
      echo "Sans option : lance backend + ng serve sur port 80 (DEV local)"
      echo "Sur serveur : utiliser --deploy pour servir via Apache"
      exit 0
      ;;
  esac
done

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[ThiDomV2]${NC} $1"; }
warn() { echo -e "${YELLOW}[ThiDomV2]${NC} $1"; }
info() { echo -e "${CYAN}[ThiDomV2]${NC} $1"; }

# Cleanup on exit
BACKEND_PID=""
FRONTEND_PID=""
cleanup() {
  log "Arret des services..."
  [ -n "$BACKEND_PID" ]  && kill "$BACKEND_PID"  2>/dev/null || true
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
  wait 2>/dev/null || true
  log "Termine."
}
trap cleanup EXIT INT TERM

# ---- Check prerequisites ----
log "Verification des prerequis..."
python3 --version >/dev/null 2>&1 || { warn "Python 3 non trouve. Installez Python 3.11+"; exit 1; }
node --version    >/dev/null 2>&1 || { warn "Node.js non trouve. Installez Node 20+";      exit 1; }
npm --version     >/dev/null 2>&1 || { warn "npm non trouve.";                              exit 1; }

# ---- Install if requested or needed ----
if [ "$DO_INSTALL" = true ]; then
  log "Installation des dependances backend..."
  cd "$BACKEND_DIR"
  [ ! -d venv ] && python3 -m venv venv
  source venv/bin/activate
  pip install -q -r requirements.txt
  deactivate

  log "Installation des dependances frontend..."
  cd "$FRONTEND_DIR"
  rm -rf node_modules
  npm install
elif [ ! -d "$FRONTEND_DIR/node_modules/@angular-devkit/build-angular" ]; then
  warn "node_modules manquant ou incomplet. Installation automatique..."
  cd "$FRONTEND_DIR"
  rm -rf node_modules
  npm install
fi

# ---- Start Backend ----
log "Demarrage du backend (port 8000)..."
cd "$BACKEND_DIR"
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
info "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
log "Attente du backend..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8000/docs >/dev/null 2>&1; then
    log "Backend pret."
    break
  fi
  sleep 1
done

# ---- Frontend ----
cd "$FRONTEND_DIR"

if [ "$DO_DEPLOY" = true ]; then
  # === PRODUCTION: build + deploy to Apache ===
  log "Build de production du frontend..."
  npx ng build --configuration production

  log "Deploiement vers $DEPLOY_DIR ..."
  sudo mkdir -p "$DEPLOY_DIR"
  sudo rm -rf "${DEPLOY_DIR:?}"/*
  sudo cp -r dist/thidom/browser/* "$DEPLOY_DIR/"
  sudo chown -R www-data:www-data /var/www/ThiDom

  log "Rechargement Apache..."
  sudo apachectl configtest && sudo systemctl reload apache2

  echo ""
  log "=============================="
  log "  ThiDomV2 deploye !"
  log "=============================="
  info "Backend  : http://localhost:8000"
  info "Swagger  : http://localhost:8000/docs"
  info "Frontend : http://<IP>/ThiDom/  (via Apache)"
  log "Appuyez sur Ctrl+C pour arreter le backend."
  echo ""

elif [ "$DO_BUILD" = true ]; then
  log "Build de production du frontend..."
  npx ng build --configuration production
  log "Build termine dans dist/thidom/browser/"
  info "Deployer avec: sudo cp -r dist/thidom/browser/* $DEPLOY_DIR/"

  echo ""
  info "Backend  : http://localhost:8000"
  log "Appuyez sur Ctrl+C pour arreter le backend."
  echo ""

else
  # === DEVELOPPEMENT: ng serve ===
  if [ "$USE_HTTPS" = true ]; then
    log "Demarrage du frontend en HTTPS (port 443)..."
    if [ ! -f ssl/server.crt ] || [ ! -f ssl/server.key ]; then
      warn "Certificats SSL absents. Generation..."
      mkdir -p ssl
      openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout ssl/server.key -out ssl/server.crt \
        -subj "/CN=localhost/O=ThiDomV2/C=FR" 2>/dev/null
    fi
    npx ng serve --host 0.0.0.0 --port 443 --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key --serve-path /ThiDom/ &
    FRONTEND_PID=$!
    info "Frontend: https://localhost/ThiDom/"
  else
    log "Demarrage du frontend en HTTP (port 4200)..."
    npx ng serve --host 0.0.0.0 --port 4200 --serve-path /ThiDom/ &
    FRONTEND_PID=$!
    info "Frontend: http://localhost:4200/ThiDom/"
  fi
  info "Frontend PID: $FRONTEND_PID"

  echo ""
  log "=============================="
  log "  ThiDomV2 demarre !"
  log "=============================="
  info "Backend  : http://localhost:8000"
  info "Swagger  : http://localhost:8000/docs"
  if [ "$USE_HTTPS" = true ]; then
    info "Frontend : https://<IP>/ThiDom/"
  else
    info "Frontend : http://<IP>:4200/ThiDom/"
  fi
  log "Appuyez sur Ctrl+C pour arreter."
  echo ""
fi

# Wait for processes
wait
