# Vercel Deployment Guide for CareerVista AI Backend

## 🚀 Deploy Backend to Vercel

Your backend is configured as a **Vercel Serverless Function** and will be deployed alongside your frontend.

### 📋 Prerequisites
- Vercel account with your frontend already deployed
- Backend code in the same repository under `/backend` folder

### 🎯 Deployment Options

#### **Option 1: Deploy as Separate Project (Recommended)**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Repository**
   - Select your `career_vista_ai` repository
   - Click **"Import"**

3. **Configure Project Settings**
   ```
   Framework Preset: Other
   Root Directory: backend
   Build Command: npm run vercel-build
   Output Directory: (leave empty)
   Install Command: npm install
   ```

4. **Add Environment Variables**
   Go to **Settings** → **Environment Variables** and add:
   ```env
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   OPENAI_API_KEY=<your-openrouter-api-key>
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   OPENAI_MODEL=google/gemini-2.0-flash-exp:free
   NODE_ENV=production
   ```

5. **Deploy!**
   - Click **"Deploy"**
   - Vercel will build and deploy your backend
   - You'll get a URL like: `https://career-vista-backend.vercel.app`

#### **Option 2: Monorepo Deployment**

If you want both frontend and backend in one Vercel project:

1. Create `vercel.json` in root:
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ]
}
```

### 📦 What Happens During Deployment

1. ✅ **Install Dependencies**: `npm install` in backend folder
2. ✅ **Build TypeScript**: `npm run vercel-build` → compiles to `dist/`
3. ✅ **Create Serverless Function**: Wraps Express app in `api/index.js`
4. ✅ **Deploy**: Makes API available at your Vercel domain

### 🔗 Update Frontend API URL

After backend deployment, update your frontend:

**File: `frontend/src/services/api.ts`**
```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.vercel.app/api'  // Your Vercel backend URL
  : 'http://localhost:8080/api';
```

Or create environment variable:

**File: `frontend/.env.production`**
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### 🌐 CORS Configuration

Your backend is already configured to accept requests from:
- ✅ `https://career-vista-ai-12.vercel.app` (your frontend)
- ✅ All `*.vercel.app` domains
- ✅ `localhost` for development

### 📊 API Endpoints

After deployment, your API will be available at:
```
https://your-backend-url.vercel.app/health
https://your-backend-url.vercel.app/api/auth/login
https://your-backend-url.vercel.app/api/tests/questions
... etc
```

### ⚠️ Vercel Serverless Limitations

**Important to know:**
- ⏱️ **10-second timeout** for Hobby plan (60s for Pro)
- 💾 **50MB deployment size limit**
- 🔄 **Cold starts** - First request may be slower
- 📦 **No persistent file system** - Use MongoDB for storage

### 🐛 Troubleshooting

**Build Fails:**
```bash
# Test build locally first
cd backend
npm run vercel-build

# Check if dist/ folder is created
ls dist/
```

**API Not Responding:**
- Check Vercel Function logs in dashboard
- Verify environment variables are set
- Ensure MongoDB connection string is correct

**CORS Errors:**
- Verify frontend domain is in CORS whitelist
- Check browser console for exact error

**Cold Start Issues:**
- First request after idle may take 3-5 seconds
- Consider Pro plan for faster cold starts
- Use keep-alive pings if needed

### 💰 Pricing

**Vercel Hobby (Free):**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth
- ✅ Serverless functions included
- ✅ Perfect for this project

**Vercel Pro ($20/month):**
- 60-second function timeout
- Priority support
- Advanced analytics

### 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

Both frontend and backend will redeploy automatically! ✨

### ✅ Deployment Checklist

- [ ] Vercel project created for backend
- [ ] Root directory set to `backend`
- [ ] Environment variables configured
- [ ] Build command: `npm run vercel-build`
- [ ] Initial deployment successful
- [ ] Health endpoint working: `/health`
- [ ] API endpoints responding: `/api/*`
- [ ] MongoDB connection verified
- [ ] Frontend updated with backend URL
- [ ] CORS working correctly
- [ ] AI features tested (OpenRouter)

### 🎉 Final Setup

1. **Deploy Backend to Vercel** → Get backend URL
2. **Update Frontend** → Point to new backend URL
3. **Redeploy Frontend** → Changes go live
4. **Test Everything** → Ensure all features work

---

**Frontend URL**: https://career-vista-ai-12.vercel.app
**Backend URL**: Will be available after deployment (e.g., `https://career-vista-backend.vercel.app`)
**Database**: MongoDB Atlas (already configured)
**AI**: OpenRouter (already configured)

Your full-stack app will be 100% serverless on Vercel! 🚀
