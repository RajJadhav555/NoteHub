@echo off
setlocal enabledelayedexpansion

:: --- Universal Project Root Detection ---
set "POTENTIAL_ROOT=%~dp0"
:: Strip trailing backslash if present (unless it's a drive root like E:\)
if "!POTENTIAL_ROOT:~-1!"=="\" if "!POTENTIAL_ROOT:~-2,1!" neq ":" set "POTENTIAL_ROOT=!POTENTIAL_ROOT:~0,-1!"

if exist "!POTENTIAL_ROOT!\backend\package.json" (
    set "PROJECT_ROOT=!POTENTIAL_ROOT!"
) else (
    if exist "e:\Notehub\backend\package.json" (
        set "PROJECT_ROOT=e:\Notehub"
    ) else (
        echo [ERROR] Could not find NoteHub project root at !POTENTIAL_ROOT! or e:\Notehub.
        pause
        exit /b 1
    )
)

cd /d "!PROJECT_ROOT!"
echo ========================================
echo NoteHub Universal Launcher
echo Project Root:     !PROJECT_ROOT!
echo Current Directory: !CD!
echo ========================================
echo.

:: Check for Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH.
    pause
    exit /b 1
)

:: Check for Node modules
if not exist "node_modules\" (
    echo [WARNING] Root node_modules not found. Installing...
    npm install
)
if not exist "backend\node_modules\" (
    echo [WARNING] Backend node_modules not found. Installing...
    cd backend && npm install && cd ..
)

echo [1/3] Starting Database...
docker compose up -d postgres 2>nul || docker-compose up -d postgres

echo.
echo Waiting for Database to be healthy...
:wait_db
set DB_STATUS=unknown
:: Check if the container is healthy using docker ps
for /f "tokens=*" %%i in ('docker ps --filter "name=notehub-db" --filter "status=healthy" --format "{{.Names}}" 2^>nul') do set DB_STATUS=%%i

if not "!DB_STATUS!"=="" (
    echo ✅ Database "notehub-db" is healthy.
) else (
    echo ⏳ Waiting for Database to become healthy...
    timeout /t 3 /nobreak >nul
    goto wait_db
)

echo.
echo [2/3] Starting Backend Server...
start "NoteHub Backend" cmd /k "echo Starting Backend in !PROJECT_ROOT!\backend... && cd /d !PROJECT_ROOT!\backend && npm start"
echo Waiting for Backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Starting Frontend (Vite)...
start "NoteHub Frontend" cmd /k "echo Starting Frontend in !PROJECT_ROOT!... && cd /d !PROJECT_ROOT! && npm run dev"
echo Waiting for Frontend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo NoteHub is starting!
echo ========================================
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5300
echo ========================================
echo.
echo Opening browser...
start http://localhost:5173

pause
