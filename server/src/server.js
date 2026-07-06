require('dotenv').config({ quiet: true });

const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`API de DriveFlow en ejecucion en el puerto ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('No se pudo iniciar la API de DriveFlow.');
  console.error(error.message);
});
