const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'La validación falló',
    errors: validationErrors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};

const positiveIdParam = (name, label) => [
  param(name)
    .isInt({ min: 1 })
    .withMessage(`${label} debe ser un entero positivo`)
    .toInt(),
  validateRequest,
];

const positiveIntegerBody = (field, label) => body(field)
  .isInt({ min: 1 })
  .withMessage(`${label} debe ser un entero positivo`)
  .toInt();

const nonNegativeIntegerBody = (field, label) => body(field)
  .isInt({ min: 0 })
  .withMessage(`${label} debe ser mayor o igual a 0`)
  .toInt();

const nonNegativeDecimalBody = (field, label) => body(field)
  .isFloat({ min: 0 })
  .withMessage(`${label} debe ser mayor o igual a 0`)
  .toFloat();

const positiveDecimalBody = (field, label) => body(field)
  .isFloat({ gt: 0 })
  .withMessage(`${label} debe ser mayor que 0`)
  .toFloat();

const isoDateTimeBody = (field, label) => body(field)
  .notEmpty()
  .withMessage(`${label} es obligatorio`)
  .bail()
  .isISO8601()
  .withMessage(`${label} debe ser una fecha u hora válida`);

const optionalTextBody = (field, label, maxLength) => body(field)
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: maxLength })
  .withMessage(`${label} no debe exceder ${maxLength} caracteres`);

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
