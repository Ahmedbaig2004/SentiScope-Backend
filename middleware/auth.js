// =============================================
// DESIGN PATTERN: Chain of Responsibility
// Purpose: Each middleware in the Express chain
// either handles the request (e.g., rejecting
// unauthorized access) or passes it to the next
// handler via next(). This middleware verifies
// JWT tokens before allowing access to protected routes.
// =============================================

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = authenticate;
