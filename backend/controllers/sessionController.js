const Session = require('../models/Session');
const Booking = require('../models/Booking');
const { emitSessionUpdate } = require('../socket');

// Get sessions for a user (student or tutor)
exports.getSessions = async (req, res) => {
  try {
    const isTutor = req.user.role === 'tutor';
    let query;
    
    if (isTutor) {
      // Tutor sees all their sessions
      query = { tutorId: req.user.userId };
    } else {
      // Student sees sessions from tutors they have booked with
      const bookings = await Booking.find({ studentId: req.user.userId }).select('tutorId');
      const tutorIds = bookings.map(b => b.tutorId);
      query = { tutorId: { $in: tutorIds } };
    }
    
    const sessions = await Session.find(query)
      .populate('tutorId', 'name email')
      .populate('studentId', 'name email')
      .sort({ date: 1, time: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new session (visible to all students who booked with this tutor)
exports.createSession = async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can create sessions' });
    }
    const { date, time, duration, mode, meetingLink } = req.body;
    
    // Session is created without a specific student - visible to all booked students
    const sessionData = {
      tutorId: req.user.userId,
      date, time, duration, mode, meetingLink
    };

    const session = new Session(sessionData);
    await session.save();
    const populatedSession = await Session.findById(session._id)
      .populate('tutorId', 'name email')
      .populate('studentId', 'name email');

    emitSessionUpdate(populatedSession);

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a session (e.g., reschedule or change status)
exports.updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Check auth
    if (session.tutorId.toString() !== req.user.userId.toString() && session.studentId?.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSession = await Session.findByIdAndUpdate(sessionId, updates, { new: true })
      .populate('tutorId', 'name email')
      .populate('studentId', 'name email');

    emitSessionUpdate(updatedSession);

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
