# Development Environment Setup Script for CareerVista Frontend
# This script sets up environment variables and starts the development server

Write-Host "🚀 Setting up CareerVista Frontend Development Environment..." -ForegroundColor Green

# Set environment variables
$env:VITE_GOOGLE_CLIENT_ID = "664830741958-ngfatn727gjfnim44id86gdjlo390rlb.apps.googleusercontent.com"
$env:VITE_API_URL = "http://localhost:8080"

Write-Host "✅ Environment variables set:" -ForegroundColor Green
Write-Host "   VITE_API_URL: $env:VITE_API_URL" -ForegroundColor Cyan
Write-Host "   VITE_GOOGLE_CLIENT_ID: $($env:VITE_GOOGLE_CLIENT_ID.Substring(0, 20))..." -ForegroundColor Cyan

Write-Host "🏁 Starting development server..." -ForegroundColor Green
pnpm dev