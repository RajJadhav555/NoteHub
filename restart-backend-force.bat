@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting Backend Server...
cd backend
start "NoteHub Backend" cmd /k "npm start"

echo.
echo Backend restarted! Check the new window.
pause
