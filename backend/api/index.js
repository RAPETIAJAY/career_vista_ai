// Vercel Serverless Function Handler
const express = require('../dist/index.js');

// Get the Express app (handle both .default and direct export)
const app = express.default || express;

// Export for Vercel
module.exports = app;