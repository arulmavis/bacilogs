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

// --- Define Your User Schema and Model ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
}, { collection: 'user_info' }); // Explicitly use the 'user_info' collection
const User = mongoose.model('User', userSchema);

// LOGIN Route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database, case-insensitively
    const user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username } });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Auth Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user to the request, but without the password hash
      req.user = await User.findById(decoded.id).select('-passwordHash');
      
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
    author: req.user.username, // Automatically set the author from the logged-in user
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
