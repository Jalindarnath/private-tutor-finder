const Tutor = require('../models/Tutor');

exports.createProfile = async (req, res) => {
  try {
    const existingProfile = await Tutor.findOne({ userId: req.user.userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const { subjects, experience, monthlyRate, location, bio, profileImage, availability } = req.body;
    
    const tutorProfile = await Tutor.create({
      userId: req.user.userId,
      subjects,
      experience,
      monthlyRate,
      availability,
      location,
      bio,
      profileImage
    });

    res.status(201).json(tutorProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { subjects, experience, monthlyRate, availability, location, bio, profileImage } = req.body;
    
    const tutorProfile = await Tutor.findOneAndUpdate(
      { userId: req.user.userId },
      { subjects, experience, monthlyRate, availability, location, bio, profileImage },
      { new: true }
    );

    if (!tutorProfile) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    res.json(tutorProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTutors = async (req, res) => {
  try {
    // Basic filter logic
    const { subject, minPrice, maxPrice, rating } = req.query;
    
    let query = {};
    if (subject) query.subjects = { $in: [new RegExp(subject, 'i')] }; // Case-insensitive match
    if (minPrice || maxPrice) {
      query.monthlyRate = {};
      if (minPrice) query.monthlyRate.$gte = Number(minPrice);
      if (maxPrice) query.monthlyRate.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };

    const tutors = await Tutor.find(query).populate('userId', 'name email');
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).populate('userId', 'name email');
    if (tutor) {
      res.json(tutor);
    } else {
      res.status(404).json({ message: 'Tutor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
