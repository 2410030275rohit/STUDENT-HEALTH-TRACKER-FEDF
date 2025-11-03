// Single serverless function that mounts the entire Express app
const serverless = require('serverless-http');
const { app, ensureDbConnected } = require('../server/app');

let handler;

module.exports = async (req, res) => {
  // Ensure DB connection (cached across warm invocations)
  await ensureDbConnected();

  if (!handler) {
    handler = serverless(app);
  }
  return handler(req, res);
};
