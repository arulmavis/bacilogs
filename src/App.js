// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import BlogPage from './Pages/BlogPage'; // Import the new BlogPage
import CreatePostPage from './Pages/CreatePostPage'; // Import the new CreatePostPage
import PostDetailPage from './Pages/PostDetailPage'; // Import for viewing a single post
import EditPostPage from './Pages/EditPostPage'; // Import for editing a post
import NotFoundPage from './Pages/NotFoundPage'; // Import the 404 page
import Footer from './Components/Footer'; // Import the Footer
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

  // Simulate fetching posts on initial load
  useEffect(() => {
    setTimeout(() => {
      const savedPosts = localStorage.getItem('blogPosts');
      setPosts(savedPosts ? JSON.parse(savedPosts) : []);
      setLoading(false);
    }, 800); // Simulate 800ms network delay
  }, []);

  const handleAddPost = (post) => {
    const newPost = { ...post, id: Date.now() }; // Add a unique ID
    setPosts(prevPosts => [...prevPosts, newPost]); // This will trigger the save to localStorage
    // Navigate back to the corresponding blog page after posting
    navigate(`/blog/${post.blogType}`);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => (post.id === updatedPost.id ? updatedPost : post)));
    navigate(`/post/${updatedPost.id}`); // Go back to the post detail page
  };

  const handleDeletePost = (postId, blogType) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      navigate(`/blog/${blogType}`); // Go back to the blog list
    }
  };

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    // Apply theme based on the current page path
    if (location.pathname.includes('/blog/willow') || (location.pathname.includes('/post/') && posts.find(p => p.id === parseInt(location.pathname.split('/')[2]))?.blogType === 'willow')) {
      document.body.setAttribute('data-theme', 'willow');
    } else if (location.pathname.includes('/blog/wishes') || (location.pathname.includes('/post/') && posts.find(p => p.id === parseInt(location.pathname.split('/')[2]))?.blogType === 'wishes')) {
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
