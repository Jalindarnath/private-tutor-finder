const Message = require('../models/Message');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');

// Get chat history between two users
exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    const message = new Message({
      senderId,
      receiverId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Get list of previous contacts (users chatted with or booked with)
exports.getContacts = async (req, res) => {
  try {
    // Include users from messages and users linked by bookings.
    const messages = await Message.find({
      $or: [{ senderId: req.user.userId }, { receiverId: req.user.userId }]
    });

    const contactIds = new Set();
    messages.forEach(msg => {
      if (msg.senderId.toString() !== req.user.userId.toString()) contactIds.add(msg.senderId.toString());
      if (msg.receiverId.toString() !== req.user.userId.toString()) contactIds.add(msg.receiverId.toString());
    });

    if (req.user.role === 'tutor') {
      const tutorProfile = await Tutor.findOne({ userId: req.user.userId });
      if (tutorProfile) {
        const tutorBookings = await Booking.find({ tutorId: tutorProfile._id }).select('studentId');
        tutorBookings.forEach((booking) => {
          if (booking.studentId) {
            contactIds.add(booking.studentId.toString());
          }
        });
      }
    }

    if (req.user.role === 'student') {
      const studentBookings = await Booking.find({ studentId: req.user.userId }).select('tutorId');
      if (studentBookings.length > 0) {
        const tutorIds = studentBookings.map((booking) => booking.tutorId);
        const tutors = await Tutor.find({ _id: { $in: tutorIds } }).select('userId');
        tutors.forEach((tutor) => {
          if (tutor.userId) {
            contactIds.add(tutor.userId.toString());
          }
        });
      }
    }

    const contacts = await User.find({ _id: { $in: Array.from(contactIds) } }).select('name email role');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

exports.sendAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can send announcements' });
    }

    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ message: 'Announcement content is required' });
    }

    const tutorProfile = await Tutor.findOne({ userId: req.user.userId });
    if (!tutorProfile) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    const bookings = await Booking.find({ tutorId: tutorProfile._id }).select('studentId');
    const studentIds = Array.from(new Set(bookings.map((booking) => booking.studentId?.toString()).filter(Boolean)));

    if (studentIds.length === 0) {
      return res.status(400).json({ message: 'No booked students found to notify' });
    }

    const payload = studentIds.map((studentId) => ({
      senderId: req.user.userId,
      receiverId: studentId,
      content
    }));

    await Message.insertMany(payload);
    res.status(201).json({ message: 'Announcement sent', recipients: studentIds.length });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
