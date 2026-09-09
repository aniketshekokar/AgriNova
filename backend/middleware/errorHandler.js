// Global Centralized Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;
  const errorCode = err.errorCode || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error(`[API ERROR] ${req.method} ${req.originalUrl} - Status ${statusCode}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export class AppError extends Error {
  constructor(message, statusCode = 400, errorCode = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default errorHandler;
