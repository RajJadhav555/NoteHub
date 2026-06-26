@echo off
cd /d "%~dp0"
echo Starting NoteHub Backend Server...
cd notehub-backend
npm run dev
