const { app, ensureDbConnected } = require('./app');
const PORT = process.env.PORT || 5000;

// Local server start with DB connection
ensureDbConnected()
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend: http://localhost:3000`);
      console.log(`Backend API: http://localhost:${PORT}`);
    });
  });