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

const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un entero positivo')
    .toInt(),
  validateRequest,
];

const createUserValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .bail()
    .isEmail()
    .withMessage('El correo debe ser válido')
    .normalizeEmail(),
  body('role_id')
    .isInt({ min: 1 })
    .withMessage('El ID de rol debe ser un entero positivo')
    .toInt(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('El teléfono no debe exceder 25 caracteres'),
  validateRequest,
];

const updateUserValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .bail()
    .isEmail()
    .withMessage('El correo debe ser válido')
    .normalizeEmail(),
  body('role_id')
    .isInt({ min: 1 })
    .withMessage('El ID de rol debe ser un entero positivo')
    .toInt(),
  body('password')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('El teléfono no debe exceder 25 caracteres'),
  validateRequest,
];

module.exports = {
  validateUserId,
  createUserValidator,
  updateUserValidator,
};
