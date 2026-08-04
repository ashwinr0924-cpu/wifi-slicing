# PowerShell script to help initialize and push this project to GitHub
Clear-Host
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "             GITHUB REPOSITORY UPLOAD HELPER             " -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Cyan

# Default pre-configured repo URL
$DEFAULT_URL = "https://github.com/ashwinr0924-cpu/wifi-slicing.git"

# 1. Check if git is installed
$gitCheck = Get-Command git -ErrorAction SilentlyContinue

if ($null -eq $gitCheck) {
    Write-Host "[!] Git is not installed or not in the PATH." -ForegroundColor Red
    Write-Host "[*] Please open a standard PowerShell/CMD window and run:" -ForegroundColor Yellow
    Write-Host "    winget install --id Git.Git" -ForegroundColor Cyan
    Write-Host "[*] Once Git installation completes, RESTART this PowerShell window and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit
}

Write-Host "[+] Git is installed and ready." -ForegroundColor Green

# 2. Check if .git exists, otherwise initialize it
if (-not (Test-Path ".git")) {
    Write-Host "[+] Initializing new Git repository..." -ForegroundColor Green
    git init -b main
} else {
    Write-Host "[+] Git repository already initialized." -ForegroundColor Green
}

# Configure local git identity if not set globally to prevent commit failures
$gitEmail = git config user.email
if ([string]::IsNullOrWhiteSpace($gitEmail)) {
    Write-Host "[*] Setting local git author credentials..." -ForegroundColor Yellow
    git config --local user.email "hackathon-developer@example.com"
    git config --local user.name "Hackathon Developer"
}

# 3. Add files and make initial commit
Write-Host "[+] Staging files..." -ForegroundColor Green
git add .

Write-Host "[+] Creating initial commit..." -ForegroundColor Green
# Fixed: Removed PowerShell-specific -ErrorAction argument from external git call
git commit -m "Initial commit: AI-Driven Network Optimizer"

# 4. Ask for GitHub Remote URL (defaulting to the user's target repo)
Write-Host ""
Write-Host "Target Repository: $DEFAULT_URL" -ForegroundColor Cyan
$remoteUrl = Read-Host "Press Enter to push to this repo, or type a new URL"

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    $remoteUrl = $DEFAULT_URL
}

# Add remote or update it
git remote remove origin 2>$null
git remote add origin $remoteUrl

Write-Host "[+] Pushing code to GitHub main branch..." -ForegroundColor Green
Write-Host "[*] A GitHub login window may pop up. Please authenticate in the browser if prompted." -ForegroundColor Yellow

# Force push to main
git branch -M main
git push -u origin main -f

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[+++] PROJECT SUCCESSFULLY UPLOADED TO GITHUB! [+++]" -ForegroundColor Green
} else {
    Write-Host "`n[!] Failed to push to GitHub. Verify the URL and authentication." -ForegroundColor Red
}

Read-Host "Press Enter to exit..."
