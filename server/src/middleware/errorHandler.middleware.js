const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    errors: error.errors || [],
  });
};

module.exports = errorHandler;
