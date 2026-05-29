@echo off
echo Installing NoteHub Dependencies...
echo.

echo [1/2] Installing Frontend Dependencies...
call npm install
echo.

echo [2/2] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo ========================================
echo Dependencies installed successfully!
echo ========================================
pause
