const User = require('../models/User');
const Tutor = require('../models/Tutor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phoneNumber,
      parentPhoneNumber,
      subjects,
      experience,
      qualification,
      monthlyRate,
      bio,
      location,
      languages,
      teachingMode,
      welcomeMessage
    } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const normalizedRole = role || 'student';

    if (normalizedRole === 'tutor') {
      if (!phoneNumber || !subjects || !Array.isArray(subjects) || subjects.length === 0 || !experience) {
        return res.status(400).json({ message: 'Phone number, subjects and experience are required for tutor signup' });
      }
    }

    if (normalizedRole === 'student' && !parentPhoneNumber) {
      return res.status(400).json({ message: 'Parent phone number is required for student signup' });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      phoneNumber,
      parentPhoneNumber
    });

    if (user && normalizedRole === 'tutor') {
      await Tutor.create({
        userId: user._id,
        subjects,
        experience,
        qualification,
        monthlyRate,
        bio,
        location,
        languages,
        teachingMode,
        welcomeMessage
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        parentPhoneNumber: user.parentPhoneNumber,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        parentPhoneNumber: user.parentPhoneNumber,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (user) {
      let tutorProfile = null;
      if (user.role === 'tutor') {
        tutorProfile = await Tutor.findOne({ userId: user._id });
      }
      res.json({ 
        ...user.toObject(), 
        userId: user._id,  // Add userId field for consistency with login endpoint
        tutorProfile 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      parentPhoneNumber,
      password,
      subjects,
      experience,
      qualification,
      monthlyRate,
      bio,
      location,
      languages,
      teachingMode,
      availability,
      welcomeMessage
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;
    user.parentPhoneNumber = parentPhoneNumber ?? user.parentPhoneNumber;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    let tutorProfile = null;
    if (user.role === 'tutor') {
      tutorProfile = await Tutor.findOneAndUpdate(
        { userId: user._id },
        {
          subjects,
          experience,
          qualification,
          monthlyRate,
          bio,
          location,
          languages,
          teachingMode,
          availability,
          welcomeMessage
        },
        { new: true, upsert: true }
      );
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      parentPhoneNumber: user.parentPhoneNumber,
      role: user.role,
      tutorProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
