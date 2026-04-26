const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, sessionController.getSessions);
router.post('/', protect, sessionController.createSession);
router.put('/:sessionId', protect, sessionController.updateSession);

module.exports = router;
