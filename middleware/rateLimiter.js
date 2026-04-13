// =============================================
// DESIGN PATTERN: Chain of Responsibility
// Purpose: Another link in the middleware chain.
// Limits how many requests a single IP can make
// to public routes, preventing abuse.
// =============================================

const rateLimit = require('express-rate-limit');

// For public survey viewing — generous limit
const publicSurveyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// For response submission — stricter to prevent spam
const responseSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Too many submissions from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// For auth routes — prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { publicSurveyLimiter, responseSubmitLimiter, authLimiter };
