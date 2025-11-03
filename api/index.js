// Single serverless function that mounts the entire Express app
const serverless = require('serverless-http');
const { app, ensureDbConnected } = require('../server/app');

let handler;

module.exports = async (req, res) => {
  // Skip DB connect for health checks and when no URI is set
  const needsDb = !!process.env.MONGODB_URI && !(req.url === '/health' || req.url.startsWith('/health?'));
  if (needsDb) {
    await ensureDbConnected();
  }

  if (!handler) {
    handler = serverless(app);
  }
  return handler(req, res);
};
