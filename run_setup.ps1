# AI Network Optimizer Launcher Script
# Run this in PowerShell to manage the project steps.

Clear-Host
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "    AI-DRIVEN ADAPTIVE HOME NETWORK OPTIMIZER LAUNCHER   " -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Cyan

Write-Host "1. [Setup] Install dependencies (pip)"
Write-Host "2. [Train] Train LightGBM Model (train_model.py)"
Write-Host "3. [Dashboard] Start Streamlit Visual UI (app.py)"
Write-Host "4. [Engine] Run Live Gateway Optimizer (main_engine.py - Run as Admin)"
Write-Host "5. Exit"
Write-Host "---------------------------------------------------------"

$choice = Read-Host "Choose an option (1-5)"

switch ($choice) {
    "1" {
        Write-Host "[+] Installing python libraries..." -ForegroundColor Green
        pip install pyshark pydivert lightgbm pandas numpy scikit-learn streamlit joblib scapy
        Write-Host "[+] Done. Please ensure Npcap/Wireshark is installed on Laptop 1." -ForegroundColor Green
    }
    "2" {
        Write-Host "[+] Running Model Trainer..." -ForegroundColor Green
        python train_model.py
    }
    "3" {
        Write-Host "[+] Launching Streamlit Dashboard..." -ForegroundColor Green
        streamlit run app.py
    }
    "4" {
        Write-Host "[+] Checking for Admin rights..." -ForegroundColor Green
        $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal($identity)
        $isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
        
        if (-not $isAdmin) {
            Write-Host "[!] WARNING: main_engine.py requires Admin rights to set QoS and clamp MSS." -ForegroundColor Red
            Write-Host "[!] Please restart PowerShell as Administrator and select option 4 again." -ForegroundColor Red
            Read-Host "Press Enter to return..."
            exit
        }
        
        Write-Host "[+] Active Network Adapters on this Computer:" -ForegroundColor Cyan
        Get-NetAdapter | Format-Table -Property Name, InterfaceDescription, Status
        
        $iface = Read-Host "Enter the adapter Name to sniff (e.g. Wi-Fi)"
        if ([string]::IsNullOrWhiteSpace($iface)) { $iface = "Wi-Fi" }
        
        $gamingIP = Read-Host "Enter the target gaming client IP (Default: 192.168.137.101)"
        if ([string]::IsNullOrWhiteSpace($gamingIP)) { $gamingIP = "192.168.137.101" }

        python main_engine.py $iface $gamingIP
    }
    "5" {
        Write-Host "Goodbye!" -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host "Invalid option." -ForegroundColor Red
    }
}
