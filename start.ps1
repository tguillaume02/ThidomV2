# =============================================================================
# ThiDomV2 - Script de demarrage complet (Backend + Frontend)
# Usage: .\start.ps1 [-Https] [-Build] [-Install]
# =============================================================================
param(
    [switch]$Https,
    [switch]$Build,
    [switch]$Install,
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$RootDir     = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir  = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

function Log($msg)  { Write-Host "[ThiDomV2] $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "[ThiDomV2] $msg" -ForegroundColor Yellow }
function Info($msg) { Write-Host "[ThiDomV2] $msg" -ForegroundColor Cyan }

if ($Help) {
    Write-Host "Usage: .\start.ps1 [-Https] [-Build] [-Install]"
    Write-Host "  -Https    Lancer le frontend en HTTPS (port 443)"
    Write-Host "  -Build    Build de production du frontend"
    Write-Host "  -Install  Installer les dependances avant de lancer"
    exit 0
}

# ---- Check prerequisites ----
Log "Verification des prerequis..."
try { python --version | Out-Null } catch { Warn "Python non trouve. Installez Python 3.11+"; exit 1 }
try { node --version   | Out-Null } catch { Warn "Node.js non trouve. Installez Node 20+";   exit 1 }
try { npm --version    | Out-Null } catch { Warn "npm non trouve.";                           exit 1 }

# ---- Install if requested ----
if ($Install) {
    Log "Installation des dependances backend..."
    Set-Location $BackendDir
    if (-not (Test-Path "venv")) {
        python -m venv venv
    }
    & .\venv\Scripts\activate.ps1
    pip install -q -r requirements.txt
    deactivate

    Log "Installation des dependances frontend..."
    Set-Location $FrontendDir
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force node_modules }
    npm install
} elseif (-not (Test-Path (Join-Path $FrontendDir "node_modules\@angular-devkit\build-angular"))) {
    Warn "node_modules manquant ou incomplet. Installation automatique..."
    Set-Location $FrontendDir
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force node_modules }
    npm install
}

# ---- Start Backend ----
Log "Demarrage du backend (port 8000)..."
Set-Location $BackendDir
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    & .\venv\Scripts\activate.ps1
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} -ArgumentList $BackendDir
Info "Backend Job ID: $($backendJob.Id)"

# Wait for backend to be ready
Log "Attente du backend..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:8000/docs" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        $ready = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}
if ($ready) { Log "Backend pret." } else { Warn "Backend pas encore pret, le frontend demarre quand meme..." }

# ---- Start Frontend ----
Set-Location $FrontendDir

if ($Build) {
    Log "Build de production du frontend..."
    npx ng build --configuration production
    Log "Build termine dans dist/thidom/browser/"
    Info "Pour servir en production, utilisez Apache avec apache.conf"
} else {
    if ($Https) {
        # Generate SSL cert if missing
        if (-not (Test-Path "ssl\server.crt") -or -not (Test-Path "ssl\server.key")) {
            Warn "Certificats SSL absents. Generation..."
            New-Item -ItemType Directory -Path ssl -Force | Out-Null
            openssl req -x509 -nodes -days 3650 -newkey rsa:2048 `
                -keyout ssl\server.key -out ssl\server.crt `
                -subj "/CN=localhost/O=ThiDomV2/C=FR" 2>$null
        }
        Log "Demarrage du frontend en HTTPS (port 443)..."
        $frontendJob = Start-Job -ScriptBlock {
            param($dir)
            Set-Location $dir
            npx ng serve --host 0.0.0.0 --port 443 --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key --serve-path /ThiDomV2/
        } -ArgumentList $FrontendDir
        Info "Frontend: https://localhost/ThiDomV2/"
    } else {
        Log "Demarrage du frontend en HTTP (port 4200)..."
        $frontendJob = Start-Job -ScriptBlock {
            param($dir)
            Set-Location $dir
            npx ng serve --host 0.0.0.0 --port 4200 --serve-path /ThiDomV2/
        } -ArgumentList $FrontendDir
        Info "Frontend: http://localhost:4200/ThiDomV2/"
    }
    Info "Frontend Job ID: $($frontendJob.Id)"
}

# ---- Summary ----
Write-Host ""
Log "=============================="
Log "  ThiDomV2 demarre !"
Log "=============================="
Info "Backend  : http://localhost:8000"
Info "Swagger  : http://localhost:8000/docs"
if (-not $Build) {
    if ($Https) {
        Info "Frontend : https://<IP>/ThiDomV2/"
    } else {
        Info "Frontend : http://<IP>:4200/ThiDomV2/"
    }
}
Log "Appuyez sur Ctrl+C pour arreter."
Write-Host ""

# ---- Wait and cleanup ----
try {
    while ($true) {
        # Show job output
        if ($backendJob) {
            Receive-Job -Job $backendJob -ErrorAction SilentlyContinue | Write-Host
        }
        if ($frontendJob) {
            Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue | Write-Host
        }
        Start-Sleep -Seconds 2
    }
} finally {
    Log "Arret des services..."
    if ($backendJob)  { Stop-Job -Job $backendJob  -ErrorAction SilentlyContinue; Remove-Job -Job $backendJob  -Force -ErrorAction SilentlyContinue }
    if ($frontendJob) { Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue; Remove-Job -Job $frontendJob -Force -ErrorAction SilentlyContinue }
    Log "Termine."
}
