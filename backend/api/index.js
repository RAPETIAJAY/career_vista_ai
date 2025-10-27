// Vercel Serverless Function Handler
// This wraps the Express app to work with Vercel's serverless architecture

const fs = require('fs');
const path = require('path');

let app;

try {
  // Debug: Check what files exist
  const distPath = path.join(__dirname, '..', 'dist');
  const distExists = fs.existsSync(distPath);
  const distIndexExists = fs.existsSync(path.join(__dirname, '..', 'dist', 'index.js'));
  
  console.log('Debug Info:', {
    __dirname,
    distPath,
    distExists,
    distIndexExists,
    cwd: process.cwd(),
    files: distExists ? fs.readdirSync(distPath).slice(0, 10) : 'dist not found'
  });
  
  // Try to load the compiled Express app
  const expressModule = require('../dist/index.js');
  app = expressModule.default || expressModule;
  
  if (!app || typeof app !== 'function') {
    throw new Error('Express app not found in dist/index.js');
  }
} catch (error) {
  console.error('Error loading Express app:', error);
  
  // Fallback: create a simple error handler
  const express = require('express');
  app = express();
  app.all('*', (req, res) => {
    res.status(500).json({
      error: 'Backend initialization failed',
      message: error.message,
      stack: error.stack,
      __dirname,
      cwd: process.cwd(),
      hint: 'Check Vercel build logs'
    });
  });
}

// Export the Express app for Vercel serverless
module.exports = app;