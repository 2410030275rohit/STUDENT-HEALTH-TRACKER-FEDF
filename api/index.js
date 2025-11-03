// Removed: serverless entrypoint for Vercel. This file is intentionally empty.
module.exports = (req, res) => {
  res.statusCode = 410;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Gone', message: 'Serverless API disabled' }));
};
