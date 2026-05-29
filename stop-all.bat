@echo off
echo Stopping NoteHub Application...
echo.

echo Stopping Docker containers...
docker-compose down

echo.
echo NoteHub stopped successfully!
pause
