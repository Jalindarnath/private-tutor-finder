let ioInstance = null;
const Booking = require('./models/Booking');

const toIdString = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return String(value._id);
  if (typeof value.toString === 'function') return value.toString();
  return null;
};

const setSocketServer = (io) => {
  ioInstance = io;
};

const emitSessionUpdate = async (session) => {
  if (!ioInstance || !session) return;

  const tutorId = toIdString(session.tutorId);
  const studentId = toIdString(session.studentId);
  const payload = { sessionId: toIdString(session._id), session };

  console.log('📡 [Socket] emitSessionUpdate called for session:', session._id);
  console.log('   tutorId:', tutorId, 'studentId:', studentId);

  // Send to tutor
  if (tutorId) {
    console.log(`   → Emitting to tutor room: user:${tutorId}`);
    ioInstance.to(`user:${tutorId}`).emit('session:updated', payload);
  }
  
  // If specific student, send to them
  if (studentId) {
    console.log(`   → Emitting to specific student room: user:${studentId}`);
    ioInstance.to(`user:${studentId}`).emit('session:updated', payload);
  } else if (tutorId) {
    // If no specific student, send to all students who have booked with this tutor
    try {
      const bookings = await Booking.find({ tutorId: session.tutorId }).select('studentId');
      console.log(`   → Found ${bookings.length} bookings for tutor ${tutorId}`);
      for (const booking of bookings) {
        const studentSocketId = toIdString(booking.studentId);
        console.log(`   → Emitting to student room: user:${studentSocketId}`);
        ioInstance.to(`user:${studentSocketId}`).emit('session:updated', payload);
      }
    } catch (error) {
      console.error('Error emitting session update to booked students:', error);
    }
  }
};

module.exports = { setSocketServer, emitSessionUpdate };
