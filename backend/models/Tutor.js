const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjects: [{ type: String }],
  experience: { type: String },
  qualification: { type: String },
  languages: [{ type: String }],
  teachingMode: { type: String, enum: ['Online', 'Offline', 'Both'], default: 'Both' },
  monthlyRate: { type: Number },
  availability: {
    days: [{ type: String }], // 'Monday', 'Tuesday', etc.
    timeSlots: [{ type: String }],
    unavailableDates: [{ type: Date }]
  },
  location: { type: String },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  bio: { type: String },
  profileImage: { type: String },
  welcomeMessage: { type: String, default: 'Welcome to my tutoring class. Looking forward to helping you learn!' }
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);
