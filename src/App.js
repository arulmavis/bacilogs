// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import BlogPage from './Pages/BlogPage'; // Import the new BlogPage
import CreatePostPage from './Pages/CreatePostPage'; // Import the new CreatePostPage
import PostDetailPage from './Pages/PostDetailPage'; // Import for viewing a single post
import EditPostPage from './Pages/EditPostPage'; // Import for editing a post
import LoginPage from './Pages/LoginPage'; // Import the new LoginPage
import NotFoundPage from './Pages/NotFoundPage'; // Import for 404 Not Found pages
import Footer from './Components/Footer';
import './App.css';

// Placeholder components for other pages
const AboutPage = () => <div className="page-container"><h1>About Us</h1></div>;
const NewsPage = () => <div className="page-container"><h1>News</h1></div>;
const ContactPage = () => <div className="page-container"><h1>Contact</h1></div>;

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [posts, setPosts] = useState([]);
  const [auth, setAuth] = useState(null); // { user, token }

  // Check for auth token in local storage on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('bacilogs_auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const handleLogin = (authData) => {
    localStorage.setItem('bacilogs_auth', JSON.stringify(authData));
    setAuth(authData);
  };

  const handleLogout = () => {
    localStorage.removeItem('bacilogs_auth');
    setAuth(null);
    navigate('/');
  };

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchPosts = () => {
    fetch(`${apiUrl}/api/posts`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setPosts(data))
      .catch(err => console.error("Failed to fetch posts:", err));
  };

  const handleAddPost = async (post) => {
    try {
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error('Failed to create post');
      fetchPosts(); // Re-fetch all posts to get the latest list
      navigate(`/blog/${post.blogType}`);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      const response = await fetch(`${apiUrl}/api/posts/${updatedPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) throw new Error('Failed to update post');
      fetchPosts(); // Re-fetch all posts
      navigate(`/post/${updatedPost._id}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId, blogType) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`${apiUrl}/api/posts/${postId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${auth.token}` },
        });
        if (!response.ok) throw new Error('Failed to delete post');
        fetchPosts(); // Re-fetch all posts
        navigate(`/blog/${blogType}`);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  // A simple protected route component
  const ProtectedRoute = ({ children }) => {
    if (!auth) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to. This allows us to send them along to that page after a
      // successful login.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  };

  // Fetch posts from API on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

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
  }, [theme, location, posts]);

  return (
    <div className="App">
      {/* Pass theme state and setter to Navbar for the toggle switch */}
      <Navbar theme={theme} setTheme={setTheme} auth={auth} onLogout={handleLogout} />
      <main>
        <Routes>
          {/* Pass posts to HomePage to display count */}
          <Route path="/" element={<HomePage posts={posts} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/blog/willow" 
            element={<BlogPage 
              blogName="Memorial of a Willow Tree" 
              blogType="willow"
              posts={posts.filter(p => p.blogType === 'willow')} 
              auth={auth}
            />} 
          />
          <Route
            path="/blog/wishes" 
            element={<BlogPage 
              blogName="Eyes Hiding Secret Wishes" 
              blogType="wishes"
              posts={posts.filter(p => p.blogType === 'wishes')} 
              auth={auth}
            />} 
          />
          <Route path="/create-post/willow" element={<ProtectedRoute><CreatePostPage blogType="willow" onAddPost={handleAddPost} auth={auth} /></ProtectedRoute>} />
          <Route path="/create-post/wishes" element={<ProtectedRoute><CreatePostPage blogType="wishes" onAddPost={handleAddPost} auth={auth} /></ProtectedRoute>} />
          <Route path="/post/:postId" element={<PostDetailPage posts={posts} onDelete={handleDeletePost} auth={auth} />} />
          <Route path="/edit-post/:postId" element={<ProtectedRoute><EditPostPage posts={posts} onUpdatePost={handleUpdatePost} auth={auth} /></ProtectedRoute>} />
          {/* Catch-all route for 404 Not Found pages */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
