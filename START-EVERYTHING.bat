@echo off
echo ==========================================
echo   SECURE MEDICAL RECORDS WEBSITE
echo   Complete Auto-Start System
echo ==========================================
echo.
echo This will automatically:
echo  1. Start MongoDB Database
echo  2. Start the Website (Frontend + Backend)
echo  3. Open your browser to the website
echo.
echo Please wait while everything starts up...
echo ==========================================
echo.

REM Create data directory if it doesn't exist
if not exist "C:\data\db" mkdir "C:\data\db"

REM Change to project directory
cd /d "C:\Users\pinet\OneDrive\Documents\DEMO 2 SHC\secure-medical-storage"

echo [1/3] Starting MongoDB Database...

REM Detect mongod.exe in common locations or on PATH
set "MONGO_EXE="
if exist "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" set "MONGO_EXE=C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
if not defined MONGO_EXE if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" set "MONGO_EXE=C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
if not defined MONGO_EXE if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" set "MONGO_EXE=C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
if not defined MONGO_EXE for /f "delims=" %%A in ('where mongod 2^>nul') do if not defined MONGO_EXE set "MONGO_EXE=%%A"

if defined MONGO_EXE (
	start "MongoDB Server" cmd /k "echo MongoDB Database Server & echo ========================== & echo Keep this window open! & echo To stop: Press Ctrl+C & echo. & \"%MONGO_EXE%\" --dbpath \"C:\data\db\""
) else (
	echo WARNING: Could not find mongod.exe. Skipping MongoDB auto-start.
	echo If you have MongoDB installed, start it manually or update MONGO_EXE path in this script.
)

echo [2/3] Waiting for MongoDB to initialize...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Website Servers...
echo.
echo Your website will open automatically when ready!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo ==========================================
echo Keep ALL windows open while using the website
echo To stop everything: Close all terminal windows
echo ==========================================
echo.

REM Start the website and wait a bit
start "Website Server" cmd /k "echo Medical Records Website Server & echo ================================ & echo Frontend: http://localhost:3000 & echo Backend: http://localhost:5000 & echo. & echo Keep this window open! & echo To stop: Press Ctrl+C & echo. & npm run dev"

REM Wait for servers to start, then open browser
echo Waiting for servers to start...
timeout /t 15 /nobreak >nul

echo Opening your website in the default browser...
start http://localhost:3000

echo.
echo ==========================================
echo SUCCESS! Your website should now be open!
echo ==========================================
echo.
echo If the website doesn't open automatically,
echo go to: http://localhost:3000
echo.
echo Keep all terminal windows open while using the website.
echo.
pause