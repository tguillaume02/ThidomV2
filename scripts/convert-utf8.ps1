<#
.SYNOPSIS
    Convertit tous les fichiers sources du projet ThiDom en UTF-8 sans BOM.
.DESCRIPTION
    Parcourt les fichiers .py, .ts, .html, .scss, .json, .md, .txt, .conf, .yml, .env, .svg
    en excluant node_modules, dist, venv, __pycache__, .git
    et les ré-écrit en UTF-8 sans BOM.
.USAGE
    .\convert-utf8.ps1
    .\convert-utf8.ps1 -RootPath "C:\mon\projet"
#>
param(
    [string]$RootPath = (Split-Path -Parent $PSScriptRoot)
)

# Si lancé depuis la racine du projet directement
if (-not (Test-Path $RootPath)) {
    $RootPath = Get-Location
}

$extensions = @("*.py","*.ts","*.html","*.scss","*.json","*.md","*.txt","*.conf","*.yml","*.env","*.svg","*.cfg")
$excludeDirs = @("node_modules",".git","dist","venv","__pycache__",".angular")

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$count = 0
$errors = 0

foreach ($ext in $extensions) {
    Get-ChildItem -Path $RootPath -Filter $ext -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $path = $_.FullName
        $skip = $false
        foreach ($dir in $excludeDirs) {
            if ($path -match [regex]::Escape("\$dir\")) { $skip = $true; break }
        }
        -not $skip
    } |
    ForEach-Object {
        try {
            $content = [System.IO.File]::ReadAllText($_.FullName)
            [System.IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
            $count++
            Write-Host "  [OK] $($_.FullName.Replace($RootPath, '.'))" -ForegroundColor Green
        } catch {
            $errors++
            Write-Host "  [ERR] $($_.FullName.Replace($RootPath, '.')) : $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Conversion terminee ===" -ForegroundColor Cyan
Write-Host "  Fichiers convertis : $count" -ForegroundColor Green
Write-Host "  Erreurs            : $errors" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Green" })
