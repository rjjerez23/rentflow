const express = require('express');
const returnController = require('../controllers/return.controller');
const {
  validateReturnId,
  createReturnValidator,
  updateReturnValidator,
} = require('../validators/return.validator');

const router = express.Router();

router.get('/', returnController.getAllReturns);
router.get('/:id', validateReturnId, returnController.getReturnById);
router.post('/', createReturnValidator, returnController.createReturn);
router.put('/:id', validateReturnId, updateReturnValidator, returnController.updateReturn);
router.delete('/:id', validateReturnId, returnController.deleteReturn);

module.exports = router;
