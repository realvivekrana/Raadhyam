import mongoose from 'mongoose';

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message = 'Bad request', code = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }
  
  static unauthorized(message = 'Unauthorized', code = 'AUTH_REQUIRED') {
    return new AppError(message, 401, code);
  }
  
  static forbidden(message = 'Access denied', code = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }
  
  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new AppError(message, 404, code);
  }
  
  static conflict(message = 'Resource conflict', code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }
  
  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
    return new AppError(message, 500, code);
  }
}

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern || {})[0] || 'field';
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  return new AppError(message, 409, 'DUPLICATE_KEY');
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors || {}).map(e => e.message);
  const message = errors.length > 0 ? errors.join(', ') : 'Validation failed';
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

const handleJWTError = () => {
  return new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
};

const handleJWTExpiredError = () => {
  return new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    code: err.code,
    errors: err.errors,
    stack: err.stack,
    path: err.path,
    method: err.method
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.errors
    });
  } else {
    console.error('UNKNOWN ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.code = err.code || 'INTERNAL_ERROR';
  
  // Clone error to avoid mutation
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;
  error.errors = err.errors;
  
  if (error.name === 'CastError') {
    error = handleCastError(error);
  }
  
  if (error.code === 11000) {
    error = handleDuplicateKeyError(error);
  }
  
  if (error.name === 'ValidationError') {
    error = handleValidationError(error);
  }
  
  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  
  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }
  
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

export const validateObjectId = (id, fieldName = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`Invalid ${fieldName} format`, 'INVALID_ID');
  }
};

export const logError = (err, req = {}, context = '') => {
  const logData = {
    timestamp: new Date().toISOString(),
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    path: req?.path,
    method: req?.method,
    ip: req?.ip,
    context
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', logData, '\nStack:', err.stack);
  } else {
    console.error('ERROR:', JSON.stringify(logData));
  }
};

export default {
  AppError,
  asyncHandler,
  globalErrorHandler,
  notFoundHandler,
  validateObjectId,
  logError
};
