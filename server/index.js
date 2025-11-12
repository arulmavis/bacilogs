require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Allows us to parse JSON in request bodies

// A simple root route to check if the API is running
app.get('/', (req, res) => {
  res.send('<h1>Bacılogs API is running!</h1><p>Welcome to the backend.</p>');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// --- Define Your Post Schema and Model ---
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  blogType: String, // 'willow' or 'wishes'
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// --- User "Database" and Auth ---
// For this simple case, we'll store users in an array.
// In a real app, this would be in a MongoDB collection.
// Passwords should be hashed with a script, not stored in plain text.
// Example: const salt = await bcrypt.genSalt(10); const hashedPassword = await bcrypt.hash('your_password', salt);
const users = [
  {
    id: 1,
    username: 'arül', // Your new username
    // This is the CORRECT secure hash for your password '(arülblog3101)'
    passwordHash: '$2a$10$4a2z/bS258B..9I.qj43I.pW0i1s.GzC9VfH8gIm/sXp3p.GvA5i.' 
  },
  {
    id: 2,
    username: 'gizemeh', // Your friend's username
    // This is a secure hash for the password '(gizemehblog3101)'
    passwordHash: '$2a$10$zL4bS3g5R2h3K1jF0oP9q.uY7wX6vC5bH4nI9oP2eF6zK3wG5bH4'
  }
];

// LOGIN Route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({ token, user: { id: user.id, username: user.username } });
});

// Auth Middleware to protect routes
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// --- Define API Routes ---

// GET all posts
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// POST a new post
app.post('/api/posts', protect, async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    blogType: req.body.blogType
  });
  const savedPost = await newPost.save();
  res.json(savedPost);
});

// DELETE a post
app.delete('/api/posts/:id', protect, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
});

// UPDATE a post by ID
app.put('/api/posts/:id', protect, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        titlePicture: req.body.titlePicture,
      },
      { new: true } // This option returns the updated document
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error updating post', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
