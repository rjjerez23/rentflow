require('dotenv').config({ quiet: true });

const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`DriveFlow API running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start DriveFlow API.');
  console.error(error.message);
});
