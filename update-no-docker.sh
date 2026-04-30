#!/usr/bin/env bash
# =============================================================================
# ThiDomV2 - Mise a jour en PRODUCTION SANS DOCKER (Linux / macOS)
#
# Telecharge l'archive de release publiee par GitHub Actions et la deploie :
#   - frontend Angular deja build  -> $WEB_DIR
#   - backend Python (sources)     -> $INSTALL_DIR/backend
#   - venv + pip install           -> $INSTALL_DIR/backend/venv
#   - reload Apache + restart du service systemd backend
#
# L'utilisateur n'a PAS besoin de Node ni de npm : tout est pre-construit.
#
# Pre-requis sur la machine cible :
#   - python3 (>= 3.11) + python3-venv
#   - apache2 (ou httpd) + mod_proxy + mod_ssl actives
#   - curl, unzip, jq
#   - un service systemd qui execute uvicorn (voir DEPLOY.md)
#
# Usage :
#   ./update-no-docker.sh                 # derniere version stable (tag v*)
#   ./update-no-docker.sh latest-master   # derniere build de master
#   ./update-no-docker.sh v1.2.3
#
# Variables d'environnement :
#   GH_REPO       proprio/repo GitHub (def: tguillaume02/ThidomV2)
#   INSTALL_DIR   racine de l'install backend (def: /opt/thidomv2)
#   WEB_DIR       repertoire servi par Apache (def: /var/www/ThiDomV2/browser)
#   SERVICE_NAME  service systemd backend (def: thidomv2-backend)
#   APACHE_SVC    service Apache (def: apache2)
#   GH_TOKEN      token GitHub (uniquement si depot prive)
# =============================================================================
set -e

GH_REPO="${GH_REPO:-tguillaume02/ThidomV2}"
INSTALL_DIR="${INSTALL_DIR:-/opt/thidomv2}"
WEB_DIR="${WEB_DIR:-/var/www/ThiDomV2/browser}"
SERVICE_NAME="${SERVICE_NAME:-thidomv2-backend}"
APACHE_SVC="${APACHE_SVC:-apache2}"

TAG="${1:-latest}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[ThiDomV2]${NC} $1"; }
warn() { echo -e "${YELLOW}[ThiDomV2]${NC} $1"; }
err()  { echo -e "${RED}[ThiDomV2]${NC} $1" >&2; }

for bin in curl unzip jq python3; do
  command -v "$bin" >/dev/null 2>&1 || { err "$bin requis. Installez-le."; exit 1; }
done

# ---------- Resolution de l'URL de l'asset ----------
log "Recherche de la release '$TAG' sur $GH_REPO..."

API_HEADERS=(-H "Accept: application/vnd.github+json")
[ -n "${GH_TOKEN:-}" ] && API_HEADERS+=(-H "Authorization: Bearer $GH_TOKEN")

if [ "$TAG" = "latest" ]; then
  API_URL="https://api.github.com/repos/$GH_REPO/releases/latest"
else
  API_URL="https://api.github.com/repos/$GH_REPO/releases/tags/$TAG"
fi

RELEASE_JSON=$(curl -sSL "${API_HEADERS[@]}" "$API_URL")
ASSET_URL=$(echo "$RELEASE_JSON" \
  | jq -r '.assets[] | select(.name=="thidomv2-release.zip") | .browser_download_url')

if [ -z "$ASSET_URL" ] || [ "$ASSET_URL" = "null" ]; then
  err "Impossible de trouver l'asset thidomv2-release.zip pour '$TAG'."
  err "Reponse API : $(echo "$RELEASE_JSON" | jq -r '.message // .')"
  exit 1
fi

# ---------- Telechargement ----------
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

log "Telechargement de $(basename "$ASSET_URL")..."
curl -sSL "${API_HEADERS[@]}" -o "$TMP_DIR/release.zip" "$ASSET_URL"

log "Extraction..."
unzip -q "$TMP_DIR/release.zip" -d "$TMP_DIR"
SRC="$TMP_DIR/thidomv2"
[ -d "$SRC" ] || { err "Archive invalide."; exit 1; }
log "Build deploye : $(cat "$SRC/MANIFEST.txt" 2>/dev/null | tr '\n' ' ')"

# ---------- Stop des services ----------
if systemctl list-unit-files | grep -q "^${SERVICE_NAME}\."; then
  log "Arret du service $SERVICE_NAME..."
  sudo systemctl stop "$SERVICE_NAME" || true
fi

# ---------- Deploiement frontend ----------
log "Deploiement du frontend vers $WEB_DIR..."
sudo mkdir -p "$WEB_DIR"
sudo rsync -a --delete "$SRC/frontend/" "$WEB_DIR/"

# ---------- Deploiement backend ----------
log "Deploiement du backend vers $INSTALL_DIR..."
sudo mkdir -p "$INSTALL_DIR"

# On preserve la base de donnees, le venv et le .env existants
PRESERVE_ARGS=(--exclude 'venv' --exclude '*.db' --exclude '.env')
sudo rsync -a --delete "${PRESERVE_ARGS[@]}" "$SRC/backend/" "$INSTALL_DIR/backend/"

# venv
if [ ! -d "$INSTALL_DIR/backend/venv" ]; then
  log "Creation du venv Python..."
  sudo python3 -m venv "$INSTALL_DIR/backend/venv"
fi

log "Mise a jour des dependances Python..."
sudo "$INSTALL_DIR/backend/venv/bin/pip" install --upgrade pip >/dev/null
sudo "$INSTALL_DIR/backend/venv/bin/pip" install -r "$INSTALL_DIR/backend/requirements.txt"

# ---------- Restart des services ----------
if systemctl list-unit-files | grep -q "^${SERVICE_NAME}\."; then
  log "Demarrage du service $SERVICE_NAME..."
  sudo systemctl start "$SERVICE_NAME"
  sudo systemctl status --no-pager "$SERVICE_NAME" | head -n 8 || true
else
  warn "Service systemd '$SERVICE_NAME' introuvable. Voir DEPLOY.md pour le creer."
fi

if systemctl list-unit-files | grep -q "^${APACHE_SVC}\."; then
  log "Reload d'Apache ($APACHE_SVC)..."
  sudo systemctl reload "$APACHE_SVC" || sudo systemctl restart "$APACHE_SVC"
fi

log "Mise a jour terminee."
