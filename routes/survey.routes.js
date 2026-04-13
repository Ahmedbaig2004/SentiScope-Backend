const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/survey.controller');
const authenticate = require('../middleware/auth');

// All survey routes require authentication (Chain of Responsibility)
router.use(authenticate);

router.post('/', surveyController.create);
router.get('/', surveyController.list);
router.get('/:id', surveyController.getById);
router.put('/:id', surveyController.update);
router.patch('/:id/status', surveyController.updateStatus);
router.delete('/:id', surveyController.remove);

module.exports = router;
