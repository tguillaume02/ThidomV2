# =============================================================================
# ThiDomV2 - Mise a jour en PRODUCTION (Windows / PowerShell)
#
# Recupere les dernieres images Docker construites par GitHub Actions
# (publiees sur ghcr.io) puis redemarre la stack. Aucun build local.
#
# Usage :
#   .\update.ps1                      # deploie le tag "latest"
#   .\update.ps1 -Tag v1.2.3          # deploie une version precise
#   .\update.ps1 -GhcrOwner tguillaume02
# =============================================================================
[CmdletBinding()]
param(
    [string]$Tag = $env:IMAGE_TAG,
    [string]$GhcrOwner = $env:GHCR_OWNER
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

if (-not $Tag)       { $Tag = "latest" }
if (-not $GhcrOwner) { $GhcrOwner = "tguillaume02" }

$env:IMAGE_TAG = $Tag
$env:GHCR_OWNER = $GhcrOwner

$composeFile = "docker-compose.prod.yml"

function Log($msg)  { Write-Host "[ThiDomV2] $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "[ThiDomV2] $msg" -ForegroundColor Yellow }

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Warn "Docker n'est pas installe. Installez Docker Desktop."
    exit 1
}

Log "Mise a jour ThiDomV2"
Log "  Owner GHCR : $GhcrOwner"
Log "  Tag image  : $Tag"

Log "Telechargement des nouvelles images..."
docker compose -f $composeFile pull

Log "Redemarrage des conteneurs..."
docker compose -f $composeFile up -d --remove-orphans

Log "Nettoyage des anciennes images..."
docker image prune -f | Out-Null

# ---------- Ecriture de backend/VERSION ----------
$versionDst = Join-Path $PSScriptRoot "backend\VERSION"
New-Item -ItemType Directory -Path (Split-Path $versionDst) -Force | Out-Null
@"
tag=$Tag
sha=
built=$(Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
mode=docker
"@ | Set-Content -Path $versionDst -Encoding ASCII

Log "Mise a jour terminee."
docker compose -f $composeFile ps
