// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import BlogPage from './Pages/BlogPage'; // Import the new BlogPage
import CreatePostPage from './Pages/CreatePostPage'; // Import the new CreatePostPage
import PostDetailPage from './Pages/PostDetailPage'; // Import for viewing a single post
import EditPostPage from './Pages/EditPostPage'; // Import for editing a post
import NotFoundPage from './Pages/NotFoundPage'; // Import for 404 Not Found pages
import Footer from './Components/Footer';
import './App.css';

// Placeholder components for other pages
const AboutPage = () => <div className="page-container"><h1>About Us</h1></div>;
const NewsPage = () => <div className="page-container"><h1>News</h1></div>;
const ContactPage = () => <div className="page-container"><h1>Contact</h1></div>;

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [posts, setPosts] = useState([]); // State to hold all blog posts

  // Fetch posts from the backend API when the component first loads
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Failed to fetch posts:", err));
  }, []); // The empty array ensures this effect runs only once

  const handleAddPost = (post) => {
    // Simulate adding a post with a temporary unique ID
    const newPost = { ...post, _id: Date.now().toString(), createdAt: new Date().toISOString() };
    setPosts(prevPosts => [...prevPosts, newPost]);
    // Navigate back to the corresponding blog page after posting
    navigate(`/blog/${post.blogType}`);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
    navigate(`/post/${updatedPost._id}`); // Go back to the post detail page
  };

  const handleDeletePost = (postId, blogType) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post._id !== postId));
      navigate(`/blog/${blogType}`); // Go back to the blog list
    }
  };

  useEffect(() => {
    // Apply theme based on the current page path
    const pathParts = location.pathname.split('/');
    const postId = pathParts[2];
    if (location.pathname.includes('/blog/willow') || (pathParts[1] === 'post' && posts.find(p => p._id === postId)?.blogType === 'willow')) {
      document.body.setAttribute('data-theme', 'willow');
    } else if (location.pathname.includes('/blog/wishes') || (pathParts[1] === 'post' && posts.find(p => p._id === postId)?.blogType === 'wishes')) {
      document.body.setAttribute('data-theme', 'wishes');
    } else {
      // For all other pages, use the light/dark theme state
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme, location.pathname, posts]);

  return (
    <div className="App">
      {/* Pass theme state and setter to Navbar for the toggle switch */}
      <Navbar theme={theme} setTheme={setTheme} />
      <main>
        <Routes>
          {/* Pass posts to HomePage to display count */}
          <Route path="/" element={<HomePage posts={posts} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route 
              path="/blog/willow" 
              element={<BlogPage 
                blogName="Memorial of a Willow Tree" 
                blogType="willow"
                posts={posts.filter(p => p.blogType === 'willow')} 
              />} 
            />
            <Route 
              path="/blog/wishes" 
              element={<BlogPage 
                blogName="Eyes Hiding Secret Wishes" 
                blogType="wishes"
                posts={posts.filter(p => p.blogType === 'wishes')} 
              />}
            />
            <Route 
              path="/create-post/willow"
              element={<CreatePostPage blogType="willow" onAddPost={handleAddPost} />}
            />
            <Route 
              path="/create-post/wishes"
              element={<CreatePostPage blogType="wishes" onAddPost={handleAddPost} />}
            />
            <Route 
              path="/post/:postId"
              element={<PostDetailPage posts={posts} onDelete={handleDeletePost} />}
            />
            <Route 
              path="/edit-post/:postId"
              element={<EditPostPage posts={posts} onUpdatePost={handleUpdatePost} />}
            />
            {/* Catch-all route for 404 Not Found pages */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
