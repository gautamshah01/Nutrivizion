@echo off
REM Nutri-Vision Frontend Deployment Script for Vercel (Windows)
REM Run this script to prepare and deploy your frontend

echo 🚀 Nutri-Vision Frontend Deployment Script
echo =========================================

REM Check if we're in the frontend directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the frontend directory
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run linting
echo 🔍 Running linter...
call npm run lint

REM Build the project
echo 🏗️  Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before deploying.
    exit /b 1
)

echo ✅ Build successful!
echo 🎉 Frontend is ready for deployment!
echo.
echo Next steps:
echo 1. Install Vercel CLI: npm install -g vercel
echo 2. Login to Vercel: vercel login
echo 3. Deploy: vercel --prod
echo.
echo Or deploy via GitHub integration at: https://vercel.com/dashboard
echo.
echo Don't forget to set environment variables in Vercel dashboard:
echo - VITE_API_URL
echo - VITE_AI_API_URL
echo - VITE_OLLAMA_API_URL

pause