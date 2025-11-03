// Single serverless function that mounts the entire Express app
// IMPORTANT: Avoid top-level heavy imports so /health can return instantly.
let handler;

module.exports = async (req, res) => {
  // Fast-path health check: reply immediately without importing Express stack
  if (req.url === '/health' || req.url.startsWith('/health?')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Lazy-load heavy modules only for non-health routes
  const serverless = require('serverless-http');
  const { app, ensureDbConnected } = require('../server/app');

  // Skip DB connect when no URI is set
  const needsDb = !!process.env.MONGODB_URI;
  if (needsDb) {
    await ensureDbConnected();
  }

  if (!handler) {
    handler = serverless(app);
  }
  return handler(req, res);
};
