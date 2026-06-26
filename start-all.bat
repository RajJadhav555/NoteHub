@echo off
setlocal enabledelayedexpansion

:: --- Project Root Detection ---
set "PROJECT_ROOT=%~dp0"
if "!PROJECT_ROOT:~-1!"=="\" set "PROJECT_ROOT=!PROJECT_ROOT:~0,-1!"

cd /d "!PROJECT_ROOT!"
echo ========================================
echo NoteHub Monorepo Launcher
echo Project Root:     !PROJECT_ROOT!
echo Current Directory: !CD!
echo ========================================
echo.

:: Run environment synchronization script to detect LAN IP and configure Expo Go
echo Syncing Environment Variables...
call node scripts/sync-env.js
if %errorlevel% neq 0 (
    echo [WARNING] Environment sync script failed. Proceeding with default configs...
)

:: Check for Docker
docker --version >nul 2>&1
set DOCKER_AVAILABLE=%errorlevel%
if %DOCKER_AVAILABLE% neq 0 (
    echo [WARNING] Docker is not installed or not running. Local database startup will be skipped.
)

:: Check for Node modules
if not exist "node_modules\" (
    echo [WARNING] Monorepo dependencies not found. Installing...
    call npm install
)

if %DOCKER_AVAILABLE%==0 (
    echo [1/4] Starting Database...
    docker compose up -d postgres 2>nul || docker-compose up -d postgres

    echo.
    echo Waiting for Database to be healthy...
    :wait_db
    set DB_STATUS=unknown
    for /f "tokens=*" %%i in ('docker ps --filter "name=notehub-db" --filter "status=healthy" --format "{{.Names}}" 2^>nul') do set DB_STATUS=%%i

    if not "!DB_STATUS!"=="" (
        echo ✅ Database "notehub-db" is healthy.
    ) else (
        echo ⏳ Waiting for Database to become healthy...
        ping 127.0.0.1 -n 4 >nul
        goto wait_db
    )
) else (
    echo [1/4] Skipping Local Database - Docker not available. Connecting to database configured in .env...
)

echo.
echo [2/4] Starting Backend Server...
start "NoteHub Backend" cmd /k "echo Starting Backend in !PROJECT_ROOT!\notehub-backend... && cd /d !PROJECT_ROOT!\notehub-backend && npm run dev"
echo Waiting for Backend to initialize...
ping 127.0.0.1 -n 6 >nul

echo.
echo [3/4] Starting Frontend (Vite)...
start "NoteHub Frontend" cmd /k "echo Starting Frontend in !PROJECT_ROOT!... && cd /d !PROJECT_ROOT! && npm run dev"
echo Waiting for Frontend to initialize...
ping 127.0.0.1 -n 6 >nul

echo.
echo [4/4] Starting Mobile Expo App...
start "NoteHub Mobile" cmd /k "echo Starting Mobile in !PROJECT_ROOT!\mobile... && cd /d !PROJECT_ROOT!\mobile && npm run start"
echo Waiting for Mobile Expo Server to initialize...
ping 127.0.0.1 -n 6 >nul

echo.
echo ========================================
echo NoteHub is starting!
echo ========================================
echo Web Frontend: http://localhost:5173
echo Backend API:  http://localhost:5300
echo Mobile App:   Expo Dev Server running on http://localhost:8081
echo ========================================
echo.
echo Opening browser to Web Frontend...
start http://localhost:5173

pause
