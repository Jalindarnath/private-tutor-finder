const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, protectTutor } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, getMyBookings);

router.route('/:id/status')
  .put(protect, protectTutor, updateBookingStatus);

module.exports = router;
