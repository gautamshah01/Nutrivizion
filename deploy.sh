#!/bin/bash

# Nutri-Vision Frontend Deployment Script for Vercel
# Run this script to prepare and deploy your frontend

echo "🚀 Nutri-Vision Frontend Deployment Script"
echo "========================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

# Test the build
echo "🧪 Testing build..."
npm run preview &
PREVIEW_PID=$!
sleep 5
kill $PREVIEW_PID

echo "🎉 Frontend is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Login to Vercel: vercel login"
echo "3. Deploy: vercel --prod"
echo ""
echo "Or deploy via GitHub integration at: https://vercel.com/dashboard"
echo ""
echo "Don't forget to set environment variables in Vercel dashboard:"
echo "- VITE_API_URL"
echo "- VITE_AI_API_URL"
echo "- VITE_OLLAMA_API_URL"