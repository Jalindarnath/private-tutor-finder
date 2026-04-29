const Session = require('../models/Session');
const Booking = require('../models/Booking');
const { emitSessionUpdate } = require('../socket');

// Get sessions for a user (student or tutor)
exports.getSessions = async (req, res) => {
  try {
    const isTutor = req.user.role === 'tutor';
    const query = isTutor ? { tutorId: req.user.userId } : { studentId: req.user.userId };
    const sessions = await Session.find(query)
      .populate('tutorId', 'name email')
      .populate('studentId', 'name email')
      .sort({ date: 1, time: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new session (Tutor creates for a student or independently linked to a booking)
exports.createSession = async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can create sessions' });
    }
    const { studentId, bookingId, date, time, duration, mode, meetingLink } = req.body;
    
    // Ensure booking actually exists and belongs to this tutor and student
    let sessionData = {
      tutorId: req.user.userId,
      date, time, duration, mode, meetingLink
    };

    if (studentId) sessionData.studentId = studentId;
    if (bookingId) sessionData.bookingId = bookingId;

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
