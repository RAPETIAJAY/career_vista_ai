// Vercel Serverless Function Handler
// This wraps the Express app to work with Vercel's serverless architecture

let app;

try {
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
      hint: 'Check Vercel build logs'
    });
  });
}

// Export the Express app for Vercel serverless
module.exports = app;