// Removed: standalone health serverless function
module.exports = (req, res) => {
  res.statusCode = 410;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Gone', message: 'Serverless health disabled' }));
};