const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminController.getDashboardStats);
router.get('/users', protect, adminController.getAllUsers);
router.delete('/users/:id', protect, adminController.deleteUser);

module.exports = router;
