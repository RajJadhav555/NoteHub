@echo off
cd /d "%~dp0"
echo Starting PostgreSQL Database with Docker...
docker-compose up -d postgres
echo Database started!
echo.
echo To view logs: docker-compose logs -f postgres
pause
