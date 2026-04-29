const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');
const Session = require('../models/Session');

exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalBookings = await Booking.countDocuments();
    const totalSessions = await Session.countDocuments();

    res.json({
      totalStudents,
      totalTutors,
      totalBookings,
      totalSessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin users' });
    
    // Delete associated tutor profile if exists
    if (user.role === 'tutor') {
      await Tutor.deleteMany({ userId });
    }
    
    // Delete associated bookings
    await Booking.deleteMany({ $or: [{ studentId: userId }, { tutorId: userId }] });
    
    // Delete associated sessions
    await Session.deleteMany({ $or: [{ studentId: userId }, { tutorId: userId }] });
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
