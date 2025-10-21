@echo off
echo 🏥 Setting up SecureMed Development Environment...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

:: Install root dependencies
call npm install

:: Install server dependencies
echo Installing server dependencies...
cd server
call npm install
cd ..

:: Install client dependencies
echo Installing client dependencies...
cd client
call npm install
cd ..

echo ⚙️ Setting up environment configuration...

:: Copy environment file if it doesn't exist
if not exist "server\.env" (
    copy "server\.env.example" "server\.env"
    echo 📝 Created server\.env file. Please update with your configuration.
) else (
    echo ✅ Environment file already exists.
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update server\.env with your MongoDB URI and other settings
echo 2. Start the development server: npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo 🚀 Happy coding!
pause