const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', templateController.list);
router.get('/:id', templateController.getById);
router.post('/:id/clone', templateController.clone);

module.exports = router;
