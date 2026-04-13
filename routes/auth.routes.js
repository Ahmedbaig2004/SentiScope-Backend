const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation schemas
const signupSchema = {
  name: { required: true, type: 'string', minLength: 2 },
  email: { required: true, type: 'string', match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, type: 'string', minLength: 6 },
};

const loginSchema = {
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
};

// Chain of Responsibility: validate -> controller
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// Chain: authenticate -> controller
router.get('/me', authenticate, authController.getMe);

module.exports = router;
