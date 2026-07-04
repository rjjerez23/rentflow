const express = require('express');
const { verifyConnection } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  const { connected } = await verifyConnection();

  res.status(200).json({
    success: true,
    message: 'DriveFlow API running',
    database: connected ? 'connected' : 'disconnected',
  });
});

module.exports = router;
