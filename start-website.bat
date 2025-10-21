@echo off
echo ==========================================
echo   Starting Medical Records Website
echo ==========================================
echo.
echo Please make sure MongoDB is running first!
echo (Run start-mongodb.bat in another window)
echo.
echo Starting website servers...
echo.

REM Change to project directory
cd /d "C:\Users\pinet\OneDrive\Documents\DEMO 2 SHC\secure-medical-storage"

REM Start both frontend and backend
echo Starting frontend (React) and backend (Node.js)...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
echo Wait for "Compiled successfully!" message, then the website will open automatically!
echo.
echo To stop the website: Press Ctrl+C
echo ==========================================

npm run dev

REM If npm run dev exits, pause to see any error messages
if errorlevel 1 (
    echo.
    echo ==========================================
    echo Error starting the website!
    echo Make sure MongoDB is running first.
    echo ==========================================
    pause
)