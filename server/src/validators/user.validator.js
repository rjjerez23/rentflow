const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: validationErrors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};

const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User id must be a positive integer')
    .toInt(),
  validateRequest,
];

const createUserValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be valid')
    .normalizeEmail(),
  body('role_id')
    .isInt({ min: 1 })
    .withMessage('Role id must be a positive integer')
    .toInt(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('Phone must not exceed 25 characters'),
  validateRequest,
];

const updateUserValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be valid')
    .normalizeEmail(),
  body('role_id')
    .isInt({ min: 1 })
    .withMessage('Role id must be a positive integer')
    .toInt(),
  body('password')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('Phone must not exceed 25 characters'),
  validateRequest,
];

module.exports = {
  validateUserId,
  createUserValidator,
  updateUserValidator,
};
