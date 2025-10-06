@echo off
echo Setting Vercel Environment Variables...
echo.
echo Go to: https://vercel.com/gautam-shahs-projects-53ab7122/nutrivizion/settings/environment-variables
echo.
echo Add these variables:
echo.
echo 1. VITE_API_URL = https://nutri-vision-backend-production.up.railway.app/api
echo 2. VITE_AI_API_URL = https://your-hf-space.hf.space  
echo 3. VITE_OLLAMA_API_URL = https://nutri-vision-backend-production.up.railway.app
echo.
echo After adding variables, redeploy with: vercel --prod
pause