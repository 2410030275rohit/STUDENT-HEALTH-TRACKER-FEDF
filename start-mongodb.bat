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

REM Try to locate mongod automatically
set "MONGO_EXE="
if exist "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" set "MONGO_EXE=C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
if not defined MONGO_EXE if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" set "MONGO_EXE=C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
if not defined MONGO_EXE if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" set "MONGO_EXE=C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
if not defined MONGO_EXE for /f "delims=" %%A in ('where mongod 2^>nul') do if not defined MONGO_EXE set "MONGO_EXE=%%A"

if defined MONGO_EXE (
	"%MONGO_EXE%" --dbpath "C:\data\db"
) else (
	echo ERROR: Could not find mongod.exe on your system.
	echo - Install MongoDB Community Server, or
	echo - Open MongoDB Compass and start a local service,
	echo then run this script again.
	pause
)

pause