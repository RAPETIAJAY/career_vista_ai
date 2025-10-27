// Vercel Serverless Function Handler
// This file imports and exports the Express app for Vercel deployment

// Import the compiled TypeScript app
const app = require('../dist/index.js').default || require('../dist/index.js');

// Export for Vercel serverless functions
module.exports = app;