# =============================================================================
# ThiDomV2 - Bootstrap d'installation initiale (Windows / PowerShell)
#
# Installe (via winget) tous les pre-requis manquants puis lance le deploiement.
#   - Python 3.11+
#   - Apache (Apache Lounge / via winget si dispo)
#   - MariaDB Server      <-- mot de passe demande a l'utilisateur
#   - Docker Desktop      (mode docker)
#
# Usage :
#   .\install.ps1
#   .\install.ps1 -Mode docker
#   .\install.ps1 -Db sqlite
#   .\install.ps1 -NonInteractive -DbPassword "MyP@ss"
#
# Idempotent : reexecutable sans risque.
# =============================================================================
[CmdletBinding()]
param(
    [ValidateSet("no-docker","docker")][string]$Mode = "no-docker",
    [ValidateSet("mariadb","sqlite")][string]$Db = "mariadb",
    [string]$DbName = "thidom",
    [string]$DbUser = "thidom",
    [string]$DbHost = "localhost",
    [int]$DbPort = 3306,
    [string]$DbPassword,
    [string]$DbRootPassword,
    [switch]$WithDump,
    [switch]$NonInteractive
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Log($m)  { Write-Host "[install] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[install] $m" -ForegroundColor Yellow }
function Err($m)  { Write-Host "[install] $m" -ForegroundColor Red }

# Verif admin
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Err "Lancez ce script dans un PowerShell *Administrateur*."
    exit 1
}

# winget requis
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Err "winget est requis. Installez 'App Installer' depuis le Microsoft Store."
    exit 1
}

function Install-IfMissing($exe, $wingetId, $label) {
    if (Get-Command $exe -ErrorAction SilentlyContinue) {
        Log "$label deja installe."
    } else {
        Log "Installation de $label ($wingetId)..."
        winget install -e --id $wingetId --accept-source-agreements --accept-package-agreements
    }
}

# ---------- Pre-requis ----------
Install-IfMissing "python"  "Python.Python.3.11" "Python 3.11"
Install-IfMissing "git"     "Git.Git"            "Git"

if ($Mode -eq "docker") {
    Install-IfMissing "docker" "Docker.DockerDesktop" "Docker Desktop"
}

if ($Db -eq "mariadb") {
    $mariadbWasPresent = [bool](Get-Service "MariaDB*" -ErrorAction SilentlyContinue)
    if (-not $mariadbWasPresent) {
        Log "Installation de MariaDB Server..."
        winget install -e --id MariaDB.Server --accept-source-agreements --accept-package-agreements
    } else {
        Log "MariaDB deja installe."
    }

    # Localiser mysql.exe
    $mysqlExe = Get-ChildItem -Path "C:\Program Files\MariaDB*\bin\mysql.exe" -ErrorAction SilentlyContinue |
                Select-Object -First 1 -ExpandProperty FullName
    if (-not $mysqlExe) { Err "mysql.exe introuvable apres installation MariaDB."; exit 1 }

    # ----- Si MariaDB vient d'etre installe : configurer root -----
    if (-not $mariadbWasPresent) {
        Log "MariaDB nouvellement installe : configuration du compte root."
        if (-not $DbRootPassword) {
            if ($NonInteractive) { Err "DbRootPassword requis en mode non-interactif (MariaDB neuf)."; exit 1 }
            while ($true) {
                $rp1 = Read-Host "Mot de passe pour 'root' MariaDB" -AsSecureString
                $rp2 = Read-Host "Confirmation" -AsSecureString
                $rs1 = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                       [Runtime.InteropServices.Marshal]::SecureStringToBSTR($rp1))
                $rs2 = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                       [Runtime.InteropServices.Marshal]::SecureStringToBSTR($rp2))
                if ($rs1 -and $rs1 -eq $rs2) { $DbRootPassword = $rs1; break }
                Warn "Mots de passe vides ou differents, recommencez."
            }
        }
        $rootSql = @"
ALTER USER 'root'@'localhost' IDENTIFIED BY '$DbRootPassword';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '$DbRootPassword';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
"@
        $rootSql | & $mysqlExe -uroot
        Log "Compte root MariaDB configure."
    } else {
        Log "MariaDB etait deja present."
        # Demander le mot de passe root existant pour les commandes mysql
        if (-not $DbRootPassword) {
            if (-not $NonInteractive) {
                # Test si connexion sans mot de passe fonctionne
                try {
                    $null = & $mysqlExe -uroot -e "SELECT 1" 2>&1
                    Log "Connexion root sans mot de passe OK."
                } catch {
                    $rp = Read-Host "Mot de passe root MariaDB existant" -AsSecureString
                    $DbRootPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($rp))
                }
            }
        }
    }

    # Construire les arguments mysql avec ou sans mot de passe
    if ($DbRootPassword) {
        $mysqlArgs = @("-uroot", "-p$DbRootPassword")
    } else {
        $mysqlArgs = @("-uroot")
    }

    # Verifier la connexion
    try {
        $null = & $mysqlExe @mysqlArgs -e "SELECT 1" 2>&1
        Log "Connexion root MariaDB OK."
    } catch {
        Err "Impossible de se connecter a MariaDB. Verifiez le mot de passe root."
        exit 1
    }

    # Mot de passe applicatif
    if (-not $DbPassword) {
        if ($NonInteractive) { Err "DbPassword requis en mode non-interactif."; exit 1 }
        while ($true) {
            $p1 = Read-Host "Mot de passe pour MariaDB '$DbUser'" -AsSecureString
            $p2 = Read-Host "Confirmation" -AsSecureString
            $s1 = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($p1))
            $s2 = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($p2))
            if ($s1 -and $s1 -eq $s2) { $DbPassword = $s1; break }
            Warn "Mots de passe vides ou differents, recommencez."
        }
    }

    Log "Creation de la base '$DbName' et de l'utilisateur '$DbUser'..."
    $sql = @"
CREATE DATABASE IF NOT EXISTS ``$DbName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DbUser'@'$DbHost' IDENTIFIED BY '$DbPassword';
ALTER USER '$DbUser'@'$DbHost' IDENTIFIED BY '$DbPassword';
GRANT ALL PRIVILEGES ON ``$DbName``.* TO '$DbUser'@'$DbHost';
FLUSH PRIVILEGES;
"@
    $sql | & $mysqlExe @mysqlArgs

    # Par defaut on n'importe PAS le dump SQL : le backend cree la structure
    # au premier demarrage via init_default_admin.py.
    if ($WithDump) {
        $dump = Join-Path $PSScriptRoot "backend\thidomv2_mysql_dump.sql"
        $tableCount = (& $mysqlExe @mysqlArgs -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DbName';").Trim()
        if ($tableCount -eq "0" -and (Test-Path $dump)) {
            Log "Import du dump $(Split-Path $dump -Leaf)..."
            Get-Content $dump | & $mysqlExe @mysqlArgs $DbName
        } else {
            Log "Base deja peuplee ou dump absent — import ignore."
        }
    } else {
        Log "Base '$DbName' creee vide (la structure sera initialisee par le backend)."
    }

    $DatabaseUrl = "mysql+aiomysql://${DbUser}:${DbPassword}@${DbHost}:${DbPort}/${DbName}"
} else {
    Log "Mode SQLite : pas d'installation de SGBD."
    $DatabaseUrl = "sqlite+aiosqlite:///./data/thidom.db"
}

# ---------- .env ----------
$envFile = Join-Path $PSScriptRoot "backend\.env"
Log "Mise a jour de $envFile..."
New-Item -ItemType Directory -Path (Split-Path $envFile) -Force | Out-Null
if (Test-Path $envFile) {
    Copy-Item $envFile "$envFile.bak.$([int][double]::Parse((Get-Date -UFormat %s)))"
    $content = Get-Content $envFile
    if ($content -match '^DATABASE_URL=') {
        $content = $content -replace '^DATABASE_URL=.*', "DATABASE_URL=$DatabaseUrl"
    } else {
        $content += "DATABASE_URL=$DatabaseUrl"
    }
    Set-Content -Path $envFile -Value $content
} else {
    $secret = -join ((48..57)+(97..122) | Get-Random -Count 64 | ForEach-Object { [char]$_ })
    @"
DATABASE_URL=$DatabaseUrl
SECRET_KEY=$secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
TIMEZONE=Europe/Paris
"@ | Set-Content -Path $envFile
}

# Remplacer SECRET_KEY par defaut
$envContent = Get-Content $envFile -Raw
if ($envContent -match 'thidom-secret-key-change-in-production') {
    $newKey = -join ((48..57)+(97..122) | Get-Random -Count 64 | ForEach-Object { [char]$_ })
    $envContent = $envContent -replace 'thidom-secret-key-change-in-production', $newKey
    Set-Content -Path $envFile -Value $envContent -NoNewline
    Log "SECRET_KEY generee automatiquement."
}
# Ajouter SECRET_KEY si absente
if ($envContent -notmatch '(?m)^SECRET_KEY=') {
    $newKey = -join ((48..57)+(97..122) | Get-Random -Count 64 | ForEach-Object { [char]$_ })
    Add-Content -Path $envFile -Value "SECRET_KEY=$newKey"
    Log "SECRET_KEY ajoutee."
}
# Remplacer token InfluxDB par defaut
$envContent = Get-Content $envFile -Raw
if ($envContent -match 'thidom-influx-token') {
    $newToken = -join ((48..57)+(97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
    $envContent = $envContent -replace 'thidom-influx-token', $newToken
    Set-Content -Path $envFile -Value $envContent -NoNewline
}

# ---------- Deploiement ----------
Log "Pre-requis OK. Lancement du deploiement (mode=$Mode)..."
if ($Mode -eq "docker") {
    & (Join-Path $PSScriptRoot "update.ps1")
} else {
    & (Join-Path $PSScriptRoot "update-no-docker.ps1")
}

# ---------- Copie du .env vers le repertoire de deploy ----------
$installDir = if ($env:INSTALL_DIR) { $env:INSTALL_DIR } else { "C:\ThiDomV2" }
$deployEnv = Join-Path $installDir "backend\.env"
if ($envFile -ne $deployEnv -and (Test-Path $envFile)) {
    New-Item -ItemType Directory -Path (Split-Path $deployEnv) -Force | Out-Null
    Copy-Item $envFile $deployEnv -Force
    Log ".env copie vers $deployEnv"
}

# ---------- Initialisation BDD + admin par defaut ----------
$venvPython = Join-Path $installDir "backend\venv\Scripts\python.exe"
$initScript = Join-Path $installDir "backend\init_default_admin.py"
if (-not (Test-Path $venvPython)) {
    $venvPython = Join-Path $PSScriptRoot "backend\venv\Scripts\python.exe"
    $initScript = Join-Path $PSScriptRoot "backend\init_default_admin.py"
}
if ((Test-Path $venvPython) -and (Test-Path $initScript)) {
    Log "Initialisation de la base et creation de l'admin par defaut..."
    Push-Location (Split-Path $initScript)
    try { & $venvPython $initScript } catch { Warn "Initialisation echouee : $_" }
    Pop-Location
} else {
    Warn "venv backend introuvable, etape d'init admin ignoree."
}

Log "Installation terminee. Connectez-vous sur http://localhost:8000/ThiDom/ avec admin / admin (a changer immediatement)."
