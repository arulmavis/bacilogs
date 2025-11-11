require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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


// --- Define API Routes ---

// GET all posts
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// POST a new post
app.post('/api/posts', async (req, res) => {
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
app.delete('/api/posts/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
});

// UPDATE a post by ID
app.put('/api/posts/:id', async (req, res) => {
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
