const Message = require('../models/Message');
const User = require('../models/User');

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
    res.status(500).json({ message: 'Server Error' });
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
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get list of previous contacts (users chatted with or booked with)
exports.getContacts = async (req, res) => {
  try {
    // Basic implementation: anyone you exchanged messages with
    const messages = await Message.find({
      $or: [{ senderId: req.user.userId }, { receiverId: req.user.userId }]
    });

    const contactIds = new Set();
    messages.forEach(msg => {
      if (msg.senderId.toString() !== req.user.userId.toString()) contactIds.add(msg.senderId.toString());
      if (msg.receiverId.toString() !== req.user.userId.toString()) contactIds.add(msg.receiverId.toString());
    });

    const contacts = await User.find({ _id: { $in: Array.from(contactIds) } }).select('name email role');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
