const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjects: [{ type: String }],
  experience: { type: String },
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
  profileImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);
