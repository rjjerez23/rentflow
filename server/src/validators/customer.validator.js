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

const validateCustomerId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Customer id must be a positive integer')
    .toInt(),
  validateRequest,
];

const customerPayloadValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('document_number')
    .trim()
    .notEmpty()
    .withMessage('Document number is required')
    .isLength({ max: 50 })
    .withMessage('Document number must not exceed 50 characters'),
  body('driver_license_number')
    .trim()
    .notEmpty()
    .withMessage('Driver license number is required')
    .isLength({ max: 50 })
    .withMessage('Driver license number must not exceed 50 characters'),
  body('driver_license_expiration_date')
    .notEmpty()
    .withMessage('Driver license expiration date is required')
    .bail()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Driver license expiration date must be a valid date'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be valid')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ max: 25 })
    .withMessage('Phone must not exceed 25 characters'),
  body('date_of_birth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .bail()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Date of birth must be a valid date')
    .bail()
    .custom((value) => {
      const dateOfBirth = new Date(`${value}T00:00:00.000Z`);
      const today = new Date();

      if (dateOfBirth > today) {
        throw new Error('Date of birth cannot be in the future');
      }

      return true;
    }),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('emergency_contact_name')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 160 })
    .withMessage('Emergency contact name must not exceed 160 characters'),
  body('emergency_contact_phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('Emergency contact phone must not exceed 25 characters'),
  validateRequest,
];

module.exports = {
  validateCustomerId,
  createCustomerValidator: customerPayloadValidator,
  updateCustomerValidator: customerPayloadValidator,
};
