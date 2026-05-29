@echo off
echo Running database migration for AI verification columns...
set PGPASSWORD=notehub_password_123
psql -h 127.0.0.1 -p 5433 -U notehub_user -d notehub_database -f backend\src\scripts\add_verification_columns.sql
echo Migration complete!
pause
