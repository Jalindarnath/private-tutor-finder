const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Tutor = require('./models/Tutor');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error(err));

const users = [
  { name: 'Admin', email: 'admin@tutor.com', password: 'adminpassword', role: 'admin' },
  { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', role: 'student' },
  { name: 'Priya Desai', email: 'priya@example.com', password: 'password123', role: 'tutor' },
  { name: 'Amit Patel', email: 'amit@example.com', password: 'password123', role: 'tutor' },
  { name: 'Neha Gupta', email: 'neha@example.com', password: 'password123', role: 'tutor' },
];

const seedData = async () => {
  try {
    await User.deleteMany();
    await Tutor.deleteMany();

    const createdUsers = [];
    for (let u of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = await User.create({ ...u, password: hashedPassword });
      createdUsers.push(user);
    }

    const tutors = createdUsers.filter(u => u.role === 'tutor');

    const tutorProfiles = [
      {
        userId: tutors[0]._id,
        subjects: ['Math', 'Physics'],
        experience: '5 years of teaching high school.',
        monthlyRate: 3500,
        location: 'Mumbai, MH',
        rating: 4.8,
        numReviews: 12,
        bio: 'Passionate about making complex physics and math concepts easy to understand.'
      },
      {
        userId: tutors[1]._id,
        subjects: ['React', 'JavaScript', 'Node.js'],
        experience: 'Senior Frontend Developer for 4 years.',
        monthlyRate: 5000,
        location: 'Bangalore, KA',
        rating: 5.0,
        numReviews: 24,
        bio: 'I will teach you how to build modern, scalable web applications from scratch.'
      },
      {
        userId: tutors[2]._id,
        subjects: ['English', 'Literature'],
        experience: 'University TA with 3 years experience.',
        monthlyRate: 2500,
        location: 'Delhi, DL',
        rating: 4.5,
        numReviews: 8,
        bio: 'Let us dive into classic literature and improve your writing and analytical skills.'
      }
    ];

    await Tutor.insertMany(tutorProfiles);

    console.log('Dummy data seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
