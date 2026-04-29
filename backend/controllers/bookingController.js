const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');
const Message = require('../models/Message');

exports.createBooking = async (req, res) => {
  try {
    const { tutorId, date, time, message } = req.body;
    
    // Prevent duplicate bookings at same time (simple check)
    // Detailed check might be needed for production
    const existing = await Booking.findOne({ tutorId, date, time });
    if(existing) {
       return res.status(400).json({ message: 'Time slot already booked' });
    }

    const tutor = await Tutor.findById(tutorId).populate('userId', 'name');
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    const booking = await Booking.create({
      studentId: req.user.userId,
      tutorId,
      date,
      time,
      message,
      status: 'accepted'
    });

    if (tutor.userId?._id) {
      await Message.create({
        senderId: tutor.userId._id,
        receiverId: req.user.userId,
        content: tutor.welcomeMessage || 'Welcome to my tutoring class. Looking forward to helping you learn!'
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'student') {
      bookings = await Booking.find({ studentId: req.user.userId })
        .populate({ path: 'tutorId', populate: { path: 'userId', select: 'name email phoneNumber' }});
    } else if (req.user.role === 'tutor') {
      const tutor = await require('../models/Tutor').findOne({ userId: req.user.userId });
      if(!tutor) {
         return res.status(404).json({ message: 'Tutor profile not found' });
      }
      bookings = await Booking.find({ tutorId: tutor._id })
        .populate('studentId', 'name email phoneNumber parentPhoneNumber');
    }
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTutorStudents = async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can access students list' });
    }

    const tutor = await Tutor.findOne({ userId: req.user.userId });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    const bookings = await Booking.find({ tutorId: tutor._id })
      .populate('studentId', 'name email phoneNumber parentPhoneNumber')
      .sort({ createdAt: -1 });

    const studentMap = new Map();
    bookings.forEach((booking) => {
      const student = booking.studentId;
      if (!student?._id) return;

      const key = student._id.toString();
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          _id: student._id,
          name: student.name,
          email: student.email,
          phoneNumber: student.phoneNumber,
          parentPhoneNumber: student.parentPhoneNumber,
          latestBookingDate: booking.date,
          latestBookingStatus: booking.status
        });
      }
    });

    res.json(Array.from(studentMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify if the user updating is the tutor of this booking
    const tutor = await require('../models/Tutor').findOne({ userId: req.user.userId });
    if (!tutor || booking.tutorId.toString() !== tutor._id.toString()) {
         return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
