#!/usr/bin/env bash
# =============================================================================
# ThiDomV2 - Mise à jour en PRODUCTION (Linux / macOS)
#
# Récupère les dernières images Docker construites par GitHub Actions
# (publiées sur ghcr.io) puis redémarre la stack. Aucun build local.
#
# Usage :
#   ./update.sh              # déploie le tag "latest"
#   ./update.sh v1.2.3       # déploie une version précise
#   GHCR_OWNER=tguillaume02 ./update.sh
# =============================================================================
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
export IMAGE_TAG="${1:-${IMAGE_TAG:-latest}}"
export GHCR_OWNER="${GHCR_OWNER:-tguillaume02}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[ThiDomV2]${NC} $1"; }
warn() { echo -e "${YELLOW}[ThiDomV2]${NC} $1"; }

if ! command -v docker >/dev/null 2>&1; then
  warn "Docker n'est pas installé. Installez Docker + Docker Compose v2."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  warn "Docker Compose introuvable."
  exit 1
fi

log "Mise à jour ThiDomV2"
log "  Owner GHCR : $GHCR_OWNER"
log "  Tag image  : $IMAGE_TAG"

# Si le dépôt/les images sont privés, l'utilisateur doit s'être déjà connecté :
#   echo $GHCR_PAT | docker login ghcr.io -u <user> --password-stdin
log "Téléchargement des nouvelles images..."
$DC -f "$COMPOSE_FILE" pull

log "Redémarrage des conteneurs..."
$DC -f "$COMPOSE_FILE" up -d --remove-orphans

log "Nettoyage des anciennes images..."
docker image prune -f >/dev/null 2>&1 || true

# ---------- Ecriture de backend/VERSION ----------
VERSION_DST="$ROOT_DIR/backend/VERSION"
mkdir -p "$(dirname "$VERSION_DST")"
cat > "$VERSION_DST" <<EOF
tag=$IMAGE_TAG
sha=
built=$(date -u +%Y-%m-%dT%H:%M:%SZ)
mode=docker
EOF

log "Mise à jour terminée."
$DC -f "$COMPOSE_FILE" ps
