// =============================================
// DESIGN PATTERN: Chain of Responsibility
// Purpose: Final handler in the middleware chain.
// Catches any errors thrown by previous handlers
// and returns a consistent error response.
// =============================================

const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
