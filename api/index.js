// Single serverless function that mounts the entire Express app
const serverless = require('serverless-http');
const { app, ensureDbConnected } = require('../server/app');

let handler;

module.exports = async (req, res) => {
  // Fast-path health check: reply immediately without Express
  if (req.url === '/health' || req.url.startsWith('/health?')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

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
