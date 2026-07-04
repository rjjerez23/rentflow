const express = require('express');
const customerController = require('../controllers/customer.controller');
const {
  validateCustomerId,
  createCustomerValidator,
  updateCustomerValidator,
} = require('../validators/customer.validator');

const router = express.Router();

router.get('/', customerController.getAllCustomers);
router.get('/:id', validateCustomerId, customerController.getCustomerById);
router.post('/', createCustomerValidator, customerController.createCustomer);
router.put('/:id', validateCustomerId, updateCustomerValidator, customerController.updateCustomer);
router.delete('/:id', validateCustomerId, customerController.deleteCustomer);

module.exports = router;
