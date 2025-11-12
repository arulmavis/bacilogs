require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema and model EXACTLY as in index.js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
}, { collection: 'user_info' }); // Explicitly use the 'user_info' collection
const User = mongoose.model('User', userSchema);

const usersToSeed = [
  { username: 'Arül', password: '(Arülblog3101)' },
  { username: 'Gizemeh', password: '(Gizemehblog1201)' }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing users to avoid duplicates
    await User.deleteMany({});
    console.log('Existing users cleared.');

    for (const userData of usersToSeed) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);
      
      const newUser = new User({ username: userData.username, passwordHash });
      await newUser.save();
      console.log(`User "${userData.username}" created successfully.`);
    }

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedUsers();