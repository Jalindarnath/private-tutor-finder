const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., '1 hour'
  mode: { type: String, enum: ['Online', 'Offline'], required: true },
  meetingLink: { type: String }, // For online mode
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
