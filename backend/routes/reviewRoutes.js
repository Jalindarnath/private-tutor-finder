const express = require('express');
const router = express.Router();
const { addReview, getTutorReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addReview);

router.route('/:tutorId')
  .get(getTutorReviews);

module.exports = router;
