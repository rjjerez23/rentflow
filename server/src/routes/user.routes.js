const express = require('express');
const userController = require('../controllers/user.controller');
const {
  validateUserId,
  createUserValidator,
  updateUserValidator,
} = require('../validators/user.validator');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', validateUserId, userController.getUserById);
router.post('/', createUserValidator, userController.createUser);
router.put('/:id', validateUserId, updateUserValidator, userController.updateUser);
router.delete('/:id', validateUserId, userController.deleteUser);

module.exports = router;
