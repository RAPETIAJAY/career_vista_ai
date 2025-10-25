# CareerVista AI - Frontend

A React-based career guidance application for Indian students with AI-powered insights and college predictions.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- A backend API server running (see backend repository)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the environment template
   cp .env.example .env
   ```

4. **Edit the `.env` file with your actual values:**
   ```env
   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   
   # API Configuration
   VITE_API_URL=http://localhost:8080
   ```

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID from Google Cloud Console | `123456789-abc.apps.googleusercontent.com` |
| `VITE_API_URL` | Backend server base URL (without /api suffix) | `http://localhost:8080` (dev) or `https://api.yourdomain.com` (prod) |

### Getting Google OAuth Client ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth client ID"
6. Choose "Web application"
7. Add your domain to authorized origins
8. Copy the Client ID to your `.env` file

### Development

```bash
# Option 1: Start with environment variables (Recommended)
pnpm run dev:env

# Option 2: Set environment variables manually and start
$env:VITE_GOOGLE_CLIENT_ID="your_google_client_id"; $env:VITE_API_URL="http://localhost:8080"; pnpm dev

# Option 3: Use .env.local file (create it first)
pnpm dev

# The app will be available at http://localhost:3000
```

**Note:** Due to Vite's environment variable loading behavior on Windows, we recommend using `pnpm run dev:env` or setting environment variables manually for the most reliable development experience.

### Building for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components and routes
├── services/           # API services and configuration
├── utils/              # Utility functions and contexts
├── theme/              # Theme configuration
└── animations.css      # Animation styles
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- The `.env.example` file is safe to commit (contains no secrets)
- Always use environment variables for sensitive data
- The `dist/` folder is ignored by git as it may contain embedded secrets

## 🚦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run linter (if configured)
- `pnpm test` - Run tests (if configured)

## 📝 Features

- **Career Insights**: AI-powered career guidance based on student profiles
- **College Predictor**: Predict admission chances for colleges
- **Chatbot**: Interactive AI counselor for career guidance
- **Scholarships**: Browse and apply for scholarships
- **Secure Authentication**: Google OAuth integration
- **Progressive Web App**: PWA capabilities for mobile experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure environment variables are properly configured
5. Test your changes locally
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## ⚠️ Important Notes

- This is the frontend application only. You need the backend API running for full functionality.
- Make sure your backend API is configured to allow CORS from your frontend domain.
- For production deployment, update `VITE_API_URL` to point to your production API server.

## � Deployment

### GitHub Pages Deployment

This project is configured for easy deployment to GitHub Pages:

```bash
# Quick deployment
pnpm run deploy

# Or use automated GitHub Actions (recommended)
# Just push to main branch after setting up GitHub secrets
```

**Setup GitHub Pages:**
1. Set repository secrets: `VITE_GOOGLE_CLIENT_ID`, `VITE_API_URL`
2. Enable GitHub Pages with "GitHub Actions" source
3. Configure Google OAuth for your GitHub Pages domain

📖 **Detailed deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Available Deployment Scripts

- `pnpm run deploy` - Manual deployment to GitHub Pages
- `pnpm run build:gh-pages` - Build for GitHub Pages
- `pnpm run predeploy` - Pre-deployment build hook

## �📞 Support

If you encounter any issues with setup or configuration, please check:
1. All environment variables are correctly set
2. Backend API is running and accessible
3. Google OAuth is properly configured
4. Dependencies are installed correctly
5. For deployment issues, check [DEPLOYMENT.md](./DEPLOYMENT.md)