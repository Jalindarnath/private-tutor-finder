let ioInstance = null;

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

const emitSessionUpdate = (session) => {
  if (!ioInstance || !session) return;

  const tutorId = toIdString(session.tutorId);
  const studentId = toIdString(session.studentId);
  const payload = { sessionId: toIdString(session._id), session };

  if (tutorId) ioInstance.to(`user:${tutorId}`).emit('session:updated', payload);
  if (studentId) ioInstance.to(`user:${studentId}`).emit('session:updated', payload);
};

module.exports = { setSocketServer, emitSessionUpdate };
