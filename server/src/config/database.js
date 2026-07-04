require('dotenv').config({ quiet: true });

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 5,
  connectTimeout: 5000,
  acquireTimeout: 5000,
  bigIntAsNumber: true,
  insertIdAsNumber: true,
});

const getConnection = () => pool.getConnection();

const verifyConnection = async () => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query('SELECT 1 AS health_check');
    return {
      connected: true,
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      error,
    };
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const testConnection = async () => {
  const { connected, error } = await verifyConnection();

  if (connected) {
    console.log('MariaDB connection established successfully.');
    return true;
  }

  if (error) {
    console.error('MariaDB connection failed. The API will continue running.');
    console.error(`Database error: ${error.message}`);
  }

  return false;
};

module.exports = {
  pool,
  getConnection,
  verifyConnection,
  testConnection,
};
