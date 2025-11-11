// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import BlogPage from './Pages/BlogPage'; // Import the new BlogPage
import CreatePostPage from './Pages/CreatePostPage'; // Import the new CreatePostPage
import PostDetailPage from './Pages/PostDetailPage'; // Import for viewing a single post
import EditPostPage from './Pages/EditPostPage'; // Import for editing a post
import NotFoundPage from './NotFoundPage';
import Footer from './Footer';
import './App.css';

// Placeholder components for other pages
const AboutPage = () => <div className="page-container"><h1>About Us</h1></div>;
const NewsPage = () => <div className="page-container"><h1>News</h1></div>;
const ContactPage = () => <div className="page-container"><h1>Contact</h1></div>;

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddPost = async (post) => {
    await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    fetchPosts(); // Refetch posts to update the list
    navigate(`/blog/${post.blogType}`);
  };

  const handleUpdatePost = async (updatedPost) => {
    // NOTE: You will need to implement the PUT/PATCH route in your backend 'server/index.js'
    await fetch(`${API_URL}/api/posts/${updatedPost._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost),
    });
    fetchPosts();
    navigate(`/post/${updatedPost._id}`);
  };

  const handleDeletePost = async (postId, blogType) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await fetch(`${API_URL}/api/posts/${postId}`, { method: 'DELETE' });
      fetchPosts();
      navigate(`/blog/${blogType}`);
    }
  };

  useEffect(() => {
    // MongoDB uses `_id`, so we need to adjust the logic here.
    // Apply theme based on the current page path
    if (location.pathname.includes('/blog/willow') || (location.pathname.startsWith('/post/') && posts.find(p => p._id === location.pathname.split('/')[2])?.blogType === 'willow')) {
      document.body.setAttribute('data-theme', 'willow');
    } else if (location.pathname.includes('/blog/wishes') || (location.pathname.startsWith('/post/') && posts.find(p => p._id === location.pathname.split('/')[2])?.blogType === 'wishes')) {
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
          <Route path="/" element={<HomePage posts={posts} loading={loading} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route 
              path="/blog/willow" 
              element={<BlogPage 
                blogName="Memorial of a Willow Tree" 
                blogType="willow"
                posts={posts.filter(p => p.blogType === 'willow')}
                loading={loading}
              />} 
            />
            <Route 
              path="/blog/wishes" 
              element={<BlogPage 
                blogName="Eyes Hiding Secret Wishes" 
                blogType="wishes"
                posts={posts.filter(p => p.blogType === 'wishes')}
                loading={loading}
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
