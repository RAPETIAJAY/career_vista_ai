# Test Deployment Script
# This script tests the build process before actual deployment

Write-Host "🧪 Testing GitHub Pages Deployment Build..." -ForegroundColor Green

# Set test environment variables
$env:GITHUB_PAGES = "true"
$env:VITE_API_URL = "https://api.example.com"
$env:VITE_GOOGLE_CLIENT_ID = "test-client-id"

Write-Host "✅ Test environment variables set" -ForegroundColor Green

# Run the build
Write-Host "🔨 Building for GitHub Pages..." -ForegroundColor Yellow
pnpm run build:gh-pages

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful! Ready for deployment." -ForegroundColor Green
    Write-Host "📁 Built files are in ./dist directory" -ForegroundColor Cyan
    Write-Host "🚀 To deploy: pnpm run deploy" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}