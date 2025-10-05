# 🚀 Nutri-Vision Frontend - Vercel Deployment Guide

## 📁 Frontend Structure (Ready for Vercel)

```
frontend/
├── src/
│   ├── components/          ← React components
│   ├── pages/              ← Route pages
│   ├── services/           ← API services (updated)
│   ├── contexts/           ← React contexts
│   ├── hooks/              ← Custom hooks
│   └── utils/              ← Utility functions
├── public/                 ← Static assets
├── dist/                   ← Build output (auto-generated)
├── package.json           ← Dependencies (✅ Ready)
├── vite.config.js         ← Build config (✅ Optimized)
├── vercel.json            ← Vercel deployment config (✅ Created)
├── .env.production        ← Production environment vars (✅ Created)
├── .env.local             ← Development environment vars (✅ Created)
└── tailwind.config.js     ← Tailwind CSS config
```

## ✅ **What's Been Prepared:**

### **1. Package.json Updates:**
- ✅ Added Node.js version requirements (`>=18.0.0`)
- ✅ All dependencies compatible with Vercel
- ✅ Build scripts optimized

### **2. Vite Configuration (vite.config.js):**
- ✅ **Build optimization** with code splitting
- ✅ **Environment variable handling** for production
- ✅ **Chunk splitting** for better caching
- ✅ **Proxy configuration** for development

### **3. Vercel Configuration (vercel.json):**
- ✅ **Static build setup** with proper routing
- ✅ **SPA routing** handled (all routes → index.html)
- ✅ **Asset caching** for optimal performance
- ✅ **Environment variable mapping**

### **4. API Services Updated:**
- ✅ **Production API URLs** configured
- ✅ **Environment-based configuration**
- ✅ **Railway backend integration** ready
- ✅ **Hugging Face Spaces AI** integration ready
- ✅ **Ollama service** integration added

### **5. Environment Variables:**
- ✅ **Development** (.env.local)
- ✅ **Production** (.env.production)
- ✅ **API endpoint configuration**

## 🚀 **Deployment Steps:**

### **Step 1: Pre-deployment Check**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Test build locally
npm run build

# Test preview
npm run preview
```

### **Step 2: Deploy to Vercel**

#### **Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **Option B: GitHub Integration**
1. Push frontend code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### **Step 3: Configure Environment Variables in Vercel**

In Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Production Environment Variables
VITE_API_URL = https://your-backend-name.railway.app/api
VITE_AI_API_URL = https://your-username-nutrivision-ai.hf.space/api
VITE_OLLAMA_API_URL = https://your-ollama-service.railway.app
VITE_APP_NAME = Nutri-Vision AI
VITE_APP_VERSION = 1.0.0
```

### **Step 4: Update API Endpoints**

After deploying backend services, update these URLs:

1. **Backend (Railway):** Replace `your-backend-name.railway.app`
2. **AI Service (HF Spaces):** Replace `your-username-nutrivision-ai.hf.space`
3. **Ollama Service (Railway):** Replace `your-ollama-service.railway.app`

## 🔧 **Key Features Ready:**

### **✅ Optimized Build:**
- Code splitting for faster loading
- Asset optimization and caching
- Minified production build
- Tree shaking for smaller bundles

### **✅ Environment Handling:**
- Automatic environment detection
- Production/development API switching
- Secure environment variables

### **✅ Routing:**
- SPA routing with history API
- All routes properly handled by Vercel
- 404 fallback to index.html

### **✅ API Integration:**
- Railway backend ready
- Hugging Face Spaces AI ready
- Ollama meal recommendations ready
- Error handling and interceptors

## 🧪 **Testing Before Deployment:**

```bash
# 1. Test development build
npm run dev

# 2. Test production build
npm run build
npm run preview

# 3. Check all routes work
# Navigate to different pages and ensure they load

# 4. Test API connections
# Check network tab in browser dev tools
```

## 🌟 **Post-Deployment Checklist:**

- [ ] **Website loads** at Vercel URL
- [ ] **All routes work** (no 404s)
- [ ] **API connections** successful
- [ ] **Authentication** working
- [ ] **Food scanner** connects to AI service
- [ ] **Meal planner** connects to Ollama
- [ ] **Responsive design** works on mobile
- [ ] **Performance** good (check Lighthouse score)

## 🔗 **Final URLs Structure:**

```
Frontend (Vercel):     https://nutri-vision.vercel.app
Backend (Railway):     https://nutrivision-backend.railway.app
AI Service (HF):       https://username-nutrivision-ai.hf.space
Ollama (Railway):      https://nutrivision-ollama.railway.app
Database (Atlas):      mongodb+srv://... (already configured)
```

## 🚨 **Common Issues & Solutions:**

### **Build Errors:**
- Check Node.js version (>=18.0.0)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### **API Connection Issues:**
- Verify environment variables in Vercel
- Check CORS settings in backend
- Ensure HTTPS URLs for production

### **Routing Issues:**
- Verify `vercel.json` configuration
- Check that all routes fallback to `index.html`

---

**🎉 Your frontend is now ready for Vercel deployment!**

The configuration automatically handles:
- ✅ Production builds
- ✅ Environment variables
- ✅ API routing
- ✅ Static asset optimization
- ✅ SPA routing

Just deploy and update the environment variables with your actual service URLs!