# 🔧 Vercel Environment Variables Setup Guide

## Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/gautam-shahs-projects-53ab7122/nutrivizion/settings/environment-variables
2. Login to your Vercel account

## Step 2: Add Environment Variables
Click "Add New" and add these variables one by one:

### Required Environment Variables:

**Variable 1:**
- Name: `VITE_API_URL`
- Value: `https://nutri-vision-backend-production.up.railway.app/api`
- Environment: Production, Preview, Development (select all)

**Variable 2:**
- Name: `VITE_AI_API_URL`
- Value: `https://your-hf-space.hf.space`
- Environment: Production, Preview, Development (select all)

**Variable 3:**
- Name: `VITE_OLLAMA_API_URL`
- Value: `https://nutri-vision-backend-production.up.railway.app`
- Environment: Production, Preview, Development (select all)

**Variable 4:**
- Name: `VITE_APP_NAME`
- Value: `Nutri-Vision AI`
- Environment: Production, Preview, Development (select all)

**Variable 5:**
- Name: `VITE_APP_VERSION`
- Value: `1.0.0`
- Environment: Production, Preview, Development (select all)

## Step 3: After Adding Variables
1. Click "Save" for each variable
2. Go to Deployments tab
3. Click "Redeploy" on the latest deployment
4. Or use CLI: `vercel --prod` from frontend directory

## Alternative: Use Vercel CLI to set variables
```bash
vercel env add VITE_API_URL production
# Enter: https://nutri-vision-backend-production.up.railway.app/api

vercel env add VITE_AI_API_URL production  
# Enter: https://your-hf-space.hf.space

vercel env add VITE_OLLAMA_API_URL production
# Enter: https://nutri-vision-backend-production.up.railway.app
```

## Quick Fix Commands (Run in frontend directory):
```bash
vercel env add VITE_API_URL
vercel env add VITE_AI_API_URL  
vercel env add VITE_OLLAMA_API_URL
vercel --prod
```