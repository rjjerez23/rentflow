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

const positiveIdParam = (name, label) => [
  param(name)
    .isInt({ min: 1 })
    .withMessage(`${label} must be a positive integer`)
    .toInt(),
  validateRequest,
];

const positiveIntegerBody = (field, label) => body(field)
  .isInt({ min: 1 })
  .withMessage(`${label} must be a positive integer`)
  .toInt();

const nonNegativeIntegerBody = (field, label) => body(field)
  .isInt({ min: 0 })
  .withMessage(`${label} must be greater than or equal to 0`)
  .toInt();

const nonNegativeDecimalBody = (field, label) => body(field)
  .isFloat({ min: 0 })
  .withMessage(`${label} must be greater than or equal to 0`)
  .toFloat();

const positiveDecimalBody = (field, label) => body(field)
  .isFloat({ gt: 0 })
  .withMessage(`${label} must be greater than 0`)
  .toFloat();

const isoDateTimeBody = (field, label) => body(field)
  .notEmpty()
  .withMessage(`${label} is required`)
  .bail()
  .isISO8601()
  .withMessage(`${label} must be a valid date or datetime`);

const optionalTextBody = (field, label, maxLength) => body(field)
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: maxLength })
  .withMessage(`${label} must not exceed ${maxLength} characters`);

module.exports = {
  validateRequest,
  positiveIdParam,
  positiveIntegerBody,
  nonNegativeIntegerBody,
  nonNegativeDecimalBody,
  positiveDecimalBody,
  isoDateTimeBody,
  optionalTextBody,
};
