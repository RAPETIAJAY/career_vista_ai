# Railway Deployment Guide for CareerVista AI Backend

## 🚀 Quick Deploy to Railway

### Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository with your backend code

### Step 1: Create New Project on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your `career_vista_ai` repository
5. Railway will automatically detect it as a Node.js project

### Step 2: Configure Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

```env
# Database
MONGODB_URI=your-mongodb-atlas-connection-string

# Server Configuration
PORT=8080
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenRouter AI Configuration
OPENAI_API_KEY=your-openrouter-api-key-here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=google/gemini-2.0-flash-exp:free

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 3: Deploy

Railway will automatically:
1. Install dependencies (`npm install`)
2. Build the TypeScript code (`npm run build`)
3. Start the server (`npm start`)

### Step 4: Get Your Backend URL

After deployment, Railway will provide a URL like:
```
https://career-vista-ai-backend-production.up.railway.app
```

### Step 5: Update Frontend

Update your frontend's API base URL to point to Railway:

In `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-railway-url.up.railway.app/api';
```

### Step 6: Configure CORS

The backend is already configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://career-vista-ai-12.vercel.app` (your frontend)

If your Railway URL is different, you may need to add it to CORS config in `src/index.ts`.

## 📊 Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments

## 🔧 Troubleshooting

### Build Fails
- Check Railway logs for TypeScript compilation errors
- Ensure all dependencies are in `package.json`

### Server Won't Start
- Verify `PORT` environment variable is set
- Check MongoDB connection string is correct
- Review application logs in Railway dashboard

### API Not Responding
- Ensure Railway deployment is running (not sleeping)
- Verify CORS settings allow your frontend domain
- Check health endpoint: `https://your-url.railway.app/health`

## 💰 Pricing

Railway offers:
- **Free Tier**: $5 credit per month
- **Pro Plan**: $20/month for production apps

## 🔄 Continuous Deployment

Railway automatically deploys when you push to your GitHub repository:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

## 📝 Custom Domain (Optional)

1. Go to Railway project → Settings → Domains
2. Click "Generate Domain" or add custom domain
3. Configure DNS if using custom domain

## ✅ Deployment Checklist

- [ ] Railway project created
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Initial deployment successful
- [ ] Health check endpoint working
- [ ] MongoDB connection verified
- [ ] Frontend updated with Railway URL
- [ ] CORS configured correctly
- [ ] AI models working (OpenRouter)

## 🆘 Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify environment variables
3. Test API endpoints with Postman/Thunder Client
4. Check MongoDB Atlas network access (allow all IPs for Railway)

---

**Your Backend URL**: Will be available after deployment
**Frontend URL**: https://career-vista-ai-12.vercel.app
**Database**: MongoDB Atlas (already configured)
