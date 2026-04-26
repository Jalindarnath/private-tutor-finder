const express = require('express');
const router = express.Router();
const { createProfile, updateProfile, getAllTutors, getTutorById } = require('../controllers/tutorController');
const { protect, protectTutor } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllTutors)
  .post(protect, protectTutor, createProfile)
  .put(protect, protectTutor, updateProfile);

router.route('/:id')
  .get(getTutorById);

module.exports = router;
