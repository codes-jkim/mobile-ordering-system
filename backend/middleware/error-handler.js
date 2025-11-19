const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      details: Object.values(err.errors).map(val => val.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format',
      details: err.message
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'A record with that value already exists. Please use a different value.',
      details: err.message
    });
  }
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;