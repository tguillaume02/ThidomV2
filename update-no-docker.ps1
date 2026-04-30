# =============================================================================
# ThiDomV2 - Mise a jour en PRODUCTION SANS DOCKER (Windows / PowerShell)
#
# Telecharge l'archive de release publiee par GitHub Actions et la deploie :
#   - frontend Angular deja build  -> $WebDir
#   - backend Python (sources)     -> $InstallDir\backend
#   - venv + pip install           -> $InstallDir\backend\venv
#   - restart du service Windows backend (si configure)
#
# Pre-requis :
#   - PowerShell 5.1+ (ou pwsh 7+)
#   - Python 3.11+ dans le PATH
#   - tar.exe (fourni avec Windows 10+) pour decompresser
#   - Apache pour Windows installe et configure
#
# Usage :
#   .\update-no-docker.ps1
#   .\update-no-docker.ps1 -Tag latest-master
#   .\update-no-docker.ps1 -Tag v1.2.3
# =============================================================================
[CmdletBinding()]
param(
    [string]$Tag = "latest",
    [string]$GhRepo = $(if ($env:GH_REPO) { $env:GH_REPO } else { "tguillaume02/ThidomV2" }),
    [string]$InstallDir = $(if ($env:INSTALL_DIR) { $env:INSTALL_DIR } else { "C:\ThiDomV2" }),
    [string]$WebDir = $(if ($env:WEB_DIR) { $env:WEB_DIR } else { "C:\ThiDomV2\www\browser" }),
    [string]$ServiceName = $(if ($env:SERVICE_NAME) { $env:SERVICE_NAME } else { "ThiDomV2Backend" }),
    [string]$ApacheService = $(if ($env:APACHE_SVC) { $env:APACHE_SVC } else { "Apache2.4" })
)

$ErrorActionPreference = "Stop"

function Log($m)  { Write-Host "[ThiDomV2] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[ThiDomV2] $m" -ForegroundColor Yellow }
function Err($m)  { Write-Host "[ThiDomV2] $m" -ForegroundColor Red }

# ---------- API GitHub : recuperer l'URL de l'asset ----------
$headers = @{ "Accept" = "application/vnd.github+json" }
if ($env:GH_TOKEN) { $headers["Authorization"] = "Bearer $($env:GH_TOKEN)" }

function Resolve-Asset([string]$t) {
    if ($t -eq "latest") {
        $u = "https://api.github.com/repos/$GhRepo/releases/latest"
    } else {
        $u = "https://api.github.com/repos/$GhRepo/releases/tags/$t"
    }
    try {
        $r = Invoke-RestMethod -Uri $u -Headers $headers -ErrorAction Stop
    } catch {
        return $null
    }
    if (-not $r.assets) { return $null }
    return ($r.assets | Where-Object { $_.name -eq "thidomv2-release.zip" } | Select-Object -First 1)
}

Log "Recherche de la release '$Tag' sur $GhRepo..."
$asset = Resolve-Asset $Tag

# Fallback : si 'latest' absent (pas encore de release stable), bascule sur 'latest-master'
if (-not $asset -and $Tag -eq "latest") {
    Warn "Aucune release stable trouvee. Bascule sur 'latest-master'..."
    $Tag = "latest-master"
    $asset = Resolve-Asset $Tag
}

if (-not $asset) {
    Err "Aucune release '$Tag' trouvee sur $GhRepo."
    Err "Verifiez https://github.com/$GhRepo/releases et la variable GH_TOKEN si depot prive."
    exit 1
}
Log "Release resolue : tag='$Tag'"

# ---------- Telechargement ----------
$tmp = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "thidomv2-$(Get-Random)") -Force
$zip = Join-Path $tmp "release.zip"

Log "Telechargement de $($asset.name)..."
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zip -Headers $headers

Log "Extraction..."
Expand-Archive -Path $zip -DestinationPath $tmp -Force
$src = Join-Path $tmp "thidomv2"
if (-not (Test-Path $src)) { Err "Archive invalide."; exit 1 }

if (Test-Path (Join-Path $src "MANIFEST.txt")) {
    Log ("Build deploye : " + ((Get-Content (Join-Path $src "MANIFEST.txt")) -join " "))
}

# ---------- Stop service backend ----------
$svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($svc) {
    Log "Arret du service $ServiceName..."
    Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
}

# ---------- Deploiement frontend ----------
Log "Deploiement du frontend vers $WebDir..."
New-Item -ItemType Directory -Path $WebDir -Force | Out-Null
robocopy (Join-Path $src "frontend") $WebDir /MIR /NFL /NDL /NJH /NJS /NP | Out-Null

# ---------- Deploiement backend (preserve venv, *.db, .env) ----------
$backendDst = Join-Path $InstallDir "backend"
Log "Deploiement du backend vers $backendDst..."
New-Item -ItemType Directory -Path $backendDst -Force | Out-Null

$exclDirs  = @("venv", "__pycache__")
$exclFiles = @("*.db", ".env")
robocopy (Join-Path $src "backend") $backendDst /MIR `
    /XD $exclDirs /XF $exclFiles `
    /NFL /NDL /NJH /NJS /NP | Out-Null

# ---------- venv + pip ----------
$venv = Join-Path $backendDst "venv"
if (-not (Test-Path $venv)) {
    Log "Creation du venv Python..."
    & python -m venv $venv
}
$pip = Join-Path $venv "Scripts\pip.exe"
Log "Mise a jour des dependances Python..."
& $pip install --upgrade pip | Out-Null
& $pip install -r (Join-Path $backendDst "requirements.txt")

# ---------- Restart services ----------
if ($svc) {
    Log "Demarrage du service $ServiceName..."
    Start-Service -Name $ServiceName
} else {
    Warn "Service Windows '$ServiceName' introuvable. Voir DEPLOY.md (NSSM)."
}

$apache = Get-Service -Name $ApacheService -ErrorAction SilentlyContinue
if ($apache) {
    Log "Restart d'Apache ($ApacheService)..."
    Restart-Service -Name $ApacheService
}

Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
Log "Mise a jour terminee."
