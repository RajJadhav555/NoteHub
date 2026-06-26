@echo off
echo ==========================================
echo NoteHub Firewall Fixer
echo ==========================================
echo This script will open port 5300 so your mobile app can reach the backend.
echo You may be prompted by Windows to grant Administrator permissions.
echo.

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator rights confirmed! Applying fix...
    netsh advfirewall firewall add rule name="NoteHub Backend Port 5300" dir=in action=allow protocol=TCP localport=5300 profile=any
    echo.
    echo ✅ Port 5300 has been successfully opened!
    echo You can now close this window and try reloading the app on your phone.
    pause
    exit
) else (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit
)
