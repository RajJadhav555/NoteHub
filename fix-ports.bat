@echo off
echo ========================================================
echo NoteHub Permanent Port Fix
echo ========================================================
echo This script will restrict the Windows dynamic port range
echo to the standard 49152-65535 to prevent Windows from
echo randomly blocking the development ports for Vite, Node, 
echo and Postgres (like 5173, 5000, 5433, 5555).
echo.

netsh int ipv4 set dynamicport tcp start=49152 num=16384
netsh int ipv6 set dynamicport tcp start=49152 num=16384

echo.
echo Restarting Windows NAT service to immediately free up
echo currently blocked ports...
echo.
net stop winnat
net start winnat

echo.
echo ========================================================
echo SUCCESS! Port issues have been resolved "once and for all".
echo You can now safely close this window.
echo ========================================================
pause
