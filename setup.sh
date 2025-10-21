#!/bin/bash

# SecureMed Development Setup Script

echo "🏥 Setting up SecureMed Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB service."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   On Windows: net start MongoDB"
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server && npm install && cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install && cd ..

echo "⚙️  Setting up environment configuration..."

# Copy environment file if it doesn't exist
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "📝 Created server/.env file. Please update with your configuration."
else
    echo "✅ Environment file already exists."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your MongoDB URI and other settings"
echo "2. Start the development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🚀 Happy coding!"