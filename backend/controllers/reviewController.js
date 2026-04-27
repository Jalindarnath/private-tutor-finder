const Review = require('../models/Review');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');

exports.addReview = async (req, res) => {
  try {
    const { tutorId, rating, comment } = req.body;

    const hasBooking = await Booking.findOne({
      studentId: req.user.userId,
      tutorId,
      status: { $in: ['accepted', 'completed'] }
    });

    if (!hasBooking) {
      return res.status(403).json({ message: 'You can only review tutors you booked' });
    }

    const alreadyReviewed = await Review.findOne({
      studentId: req.user.userId,
      tutorId
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Already reviewed this tutor' });
    }

    const review = await Review.create({
      studentId: req.user.userId,
      tutorId,
      rating: Number(rating),
      comment
    });

    // Update tutor's average rating
    const reviews = await Review.find({ tutorId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    await Tutor.findByIdAndUpdate(tutorId, {
      rating: avgRating,
      numReviews
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutorId: req.params.tutorId }).populate('studentId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTutorReviews = async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can access this resource' });
    }

    const tutorProfile = await Tutor.findOne({ userId: req.user.userId });
    if (!tutorProfile) {
      return res.json([]);
    }

    const reviews = await Review.find({ tutorId: tutorProfile._id })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
