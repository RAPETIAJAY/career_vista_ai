// Simple entrypoint that loads and exports the Express app
// This runs TypeScript compilation if needed, then serves the app

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if dist folder exists, if not, build it
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath) || !fs.existsSync(path.join(distPath, 'index.js'))) {
  console.log('Building TypeScript...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  } catch (error) {
    console.error('Build failed:', error);
  }
}

// Load the Express app
let app;
try {
  const expressModule = require('./dist/index.js');
  app = expressModule.default || expressModule;
  console.log('Express app loaded successfully');
} catch (error) {
  console.error('Failed to load Express app:', error);
  const express = require('express');
  app = express();
  app.all('*', (req, res) => {
    res.status(500).json({
      error: 'Backend failed to initialize',
      message: error.message,
      stack: error.stack
    });
  });
}

module.exports = app;
