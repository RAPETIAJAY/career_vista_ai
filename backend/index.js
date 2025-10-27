// Root entrypoint for Vercel serverless deployment
const express = require('express'); // Vercel needs to see this import

// Load the actual Express app from api/index.js
const app = require('./api/index.js');

// Export for Vercel
module.exports = app;
