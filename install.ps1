# Installs (or restores) the ELITE DESIGN DIRECTOR skill for Claude Code.
# Usage (PowerShell, from this folder):  .\install.ps1
# If a copy is already installed, it is backed up first (never silently overwritten).

$ErrorActionPreference = 'Stop'
$src  = Join-Path $PSScriptRoot 'elite-design-director'
$dest = Join-Path $env:USERPROFILE '.claude\skills\elite-design-director'

if (-not (Test-Path (Join-Path $src 'SKILL.md'))) { throw "SKILL.md not found in $src" }
New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null

if (Test-Path $dest) {
    $backup = "$dest.backup-" + (Get-Date -Format 'yyyyMMdd-HHmmss')
    Move-Item $dest $backup
    Write-Host "Existing skill backed up to: $backup"
}
Copy-Item $src $dest -Recurse
Write-Host "Installed to: $dest"
Write-Host "Restart Claude Code, then use:  /elite-design-director"
