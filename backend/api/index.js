// Vercel Serverless Function Handler
// This wraps the Express app to work with Vercel's serverless architecture

const fs = require('fs');
const path = require('path');

let app;

try {
  // Debug: Check what files exist
  const parentDir = path.join(__dirname, '..');
  const distPath = path.join(parentDir, 'dist');
  const distIndexPath = path.join(distPath, 'index.js');
  
  const debug = {
    __dirname,
    parentDir,
    distPath,
    distExists: fs.existsSync(distPath),
    distIndexExists: fs.existsSync(distIndexPath),
    cwd: process.cwd(),
    parentDirContents: fs.existsSync(parentDir) ? fs.readdirSync(parentDir) : 'not found',
    distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath).slice(0, 10) : 'dist not found'
  };
  
  console.log('Debug Info:', JSON.stringify(debug, null, 2));
  
  // Try to load the compiled Express app
  const expressModule = require('../dist/index.js');
  app = expressModule.default || expressModule;
  
  if (!app || typeof app !== 'function') {
    throw new Error('Express app not found in dist/index.js');
  }
  
  console.log('✓ Express app loaded successfully');
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
      hint: 'Check Vercel build logs and runtime logs'
    });
  });
}

// Export the Express app for Vercel serverless
module.exports = app;