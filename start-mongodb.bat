@echo off
echo ==========================================
echo   Starting MongoDB Database Server
echo ==========================================
echo.
echo Starting MongoDB... Please wait...
echo.

REM Create data directory if it doesn't exist
if not exist "C:\data\db" mkdir "C:\data\db"

REM Start MongoDB
echo MongoDB is starting on port 27017...
echo Keep this window open while using the website!
echo.
echo To stop MongoDB: Press Ctrl+C
echo ==========================================

"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"

pause