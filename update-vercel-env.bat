@echo off
echo Updating Vercel environment variables for Nutri-Vision...

REM Set production environment variables
vercel env add VITE_API_URL production
vercel env add VITE_AI_API_URL production  
vercel env add VITE_OLLAMA_API_URL production
vercel env add VITE_APP_NAME production
vercel env add VITE_APP_VERSION production
vercel env add VITE_NODE_ENV production

echo.
echo Please enter the following values when prompted:
echo VITE_API_URL: https://nutri-vision-backend-production.up.railway.app/api
echo VITE_AI_API_URL: https://nutri-vision-backend-production.up.railway.app/api/ai
echo VITE_OLLAMA_API_URL: https://nutri-vision-backend-production.up.railway.app
echo VITE_APP_NAME: Nutri-Vision AI
echo VITE_APP_VERSION: 1.0.0
echo VITE_NODE_ENV: production
echo.
echo After setting all variables, run: vercel --prod
pause