const express = require('express');
const router = express.Router();
const { addReview, getTutorReviews, getMyTutorReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addReview);

router.route('/my')
  .get(protect, getMyTutorReviews);

router.route('/:tutorId')
  .get(getTutorReviews);

module.exports = router;
