@echo off
cd /d "%~dp0"
echo ========================================
echo Installing NoteHub Monorepo Dependencies
echo ========================================
echo.

echo Running npm install at workspace root...
call npm install

echo.
echo ========================================
echo Monorepo dependencies installed successfully!
echo ========================================
pause
