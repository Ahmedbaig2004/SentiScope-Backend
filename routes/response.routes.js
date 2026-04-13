const express = require('express');
const router = express.Router();
const responseController = require('../controllers/response.controller');
const authenticate = require('../middleware/auth');
const { publicSurveyLimiter, responseSubmitLimiter } = require('../middleware/rateLimiter');

// Public routes — rate limited (Chain of Responsibility)
router.get('/public/survey/:id', publicSurveyLimiter, responseController.getPublicSurvey);
router.post('/responses', responseSubmitLimiter, responseController.submit);

// Protected routes (survey owner)
router.get('/surveys/:id/responses', authenticate, responseController.listBySurvey);

module.exports = router;
