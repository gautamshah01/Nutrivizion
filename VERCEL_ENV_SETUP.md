# 🚀 Vercel Environment Variables Setup

## Go to Vercel Dashboard and set these environment variables:

1. **Go to**: https://vercel.com/gautam-shahs-projects-53ab7122/nutrivizion/settings/environment-variables

2. **Add these variables**:

### Production Environment Variables:
```
VITE_API_URL = https://nutri-vision-backend-production.up.railway.app
VITE_AI_API_URL = https://your-hf-space.hf.space
VITE_OLLAMA_API_URL = https://nutri-vision-backend-production.up.railway.app
VITE_APP_NAME = Nutri-Vision AI
VITE_APP_VERSION = 1.0.0
VITE_NODE_ENV = production
```

3. **Apply to**: Production, Preview, and Development

4. **Redeploy**: After setting variables, redeploy with `vercel --prod`

## Current Status:
✅ Frontend deployed with Railway API URL
✅ Backend running on Railway  
⏳ Environment variables need to be set in Vercel dashboard