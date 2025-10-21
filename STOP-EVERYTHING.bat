@echo off
echo ==========================================
echo   Stopping Medical Records Website
echo ==========================================
echo.
echo This will stop all website services...
echo.

REM Kill Node.js processes (website servers)
echo Stopping website servers...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM nodemon.exe 2>nul

REM Kill MongoDB process
echo Stopping MongoDB database...
taskkill /F /IM mongod.exe 2>nul

REM Kill any remaining npm processes
taskkill /F /IM npm.exe 2>nul

echo.
echo ==========================================
echo All services have been stopped!
echo ==========================================
echo.
echo Your website data is safely saved in MongoDB.
echo To restart: Double-click "START-EVERYTHING.bat"
echo.
pause