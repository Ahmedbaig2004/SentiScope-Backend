const express = require('express');
const router = express.Router();
const responseController = require('../controllers/response.controller');
const authenticate = require('../middleware/auth');

// Public routes (no auth needed — respondents)
router.get('/public/survey/:id', responseController.getPublicSurvey);
router.post('/responses', responseController.submit);

// Protected routes (survey owner)
router.get('/surveys/:id/responses', authenticate, responseController.listBySurvey);

module.exports = router;
