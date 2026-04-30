const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@tutor.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
const adminName = process.env.ADMIN_NAME || 'Admin';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        }
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    console.log('Admin account is ready:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();