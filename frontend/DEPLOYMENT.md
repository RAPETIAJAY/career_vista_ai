# GitHub Pages Deployment Guide

This guide explains how to deploy your CareerVista frontend to GitHub Pages.

## 🚀 Quick Deployment

### Method 1: Automated Deployment (Recommended)

1. **Setup Repository:**
   ```bash
   # Initialize git repository (if not already done)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Add GitHub remote (replace with your repository URL)
   git remote add origin https://github.com/yourusername/proj1.git
   git branch -M main
   git push -u origin main
   ```

2. **Configure GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID for production
     - `VITE_API_URL`: Your production API URL (optional, defaults to demo URL)

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on every push to main branch

### Method 2: Manual Deployment

```bash
# Build and deploy manually
pnpm run deploy
```

## 🔧 Configuration

### Google OAuth Setup for Production

1. **Update Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project → Credentials
   - Edit your OAuth 2.0 Client ID
   - Add your GitHub Pages URL to "Authorized JavaScript origins":
     - `https://yourusername.github.io`
   - Add to "Authorized redirect URIs":
     - `https://yourusername.github.io/proj1`
     - `https://yourusername.github.io/proj1/`

2. **Create Production Client ID (Recommended):**
   - Create a separate OAuth client ID for production
   - Use this in your GitHub secrets

### API Configuration

**If you have a production API:**
- Set `VITE_API_URL` secret to your production API URL
- Ensure your API allows CORS from your GitHub Pages domain

**If using development API:**
- Leave `VITE_API_URL` secret empty (uses default)
- Note: GitHub Pages (HTTPS) cannot call HTTP APIs due to mixed content restrictions

## 📁 Project Structure for Deployment

```
frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── dist/                       # Built files (auto-generated)
├── src/                        # Source code
├── .env.example               # Development environment template
├── .env.production.example    # Production environment template
├── .gitignore                 # Includes environment files
├── package.json               # Includes deployment scripts
├── vite.config.ts             # Configured for GitHub Pages
└── README.md                  # This file
```

## 🔍 Troubleshooting

### Common Issues

1. **404 on Refresh:**
   - GitHub Pages doesn't support client-side routing by default
   - Add a `404.html` that redirects to `index.html` if needed

2. **Environment Variables Not Loading:**
   - Ensure secrets are properly set in GitHub repository
   - Check GitHub Actions logs for build errors

3. **Google OAuth Not Working:**
   - Verify authorized domains in Google Cloud Console
   - Check that you're using the production Client ID

4. **API Calls Failing:**
   - HTTPS sites (GitHub Pages) cannot call HTTP APIs
   - Ensure your production API uses HTTPS

### Debugging

**Check deployment logs:**
- Go to Actions tab in your GitHub repository
- Click on the latest deployment workflow
- Review build and deploy logs

**Test locally:**
```bash
# Test production build locally
pnpm run build:gh-pages
pnpm run preview
```

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file:**
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Configure DNS:**
   - Add CNAME record pointing to `yourusername.github.io`

3. **Update Google OAuth:**
   - Add your custom domain to authorized origins

## 📝 Post-Deployment Checklist

- [ ] Site loads correctly at GitHub Pages URL
- [ ] Google OAuth works with production credentials  
- [ ] API calls work (or fallback gracefully)
- [ ] All routes are accessible
- [ ] Environment variables are properly configured
- [ ] No console errors in production

## 🔗 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)