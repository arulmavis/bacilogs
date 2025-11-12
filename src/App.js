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

  const handleAddPost = (post) => {
    // This will be replaced with an API call
    const newPost = { ...post, id: Date.now(), _id: Date.now().toString() }; // Use _id for consistency with MongoDB
    setPosts(prevPosts => [...prevPosts, newPost]);
    navigate(`/blog/${post.blogType}`);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
    navigate(`/post/${updatedPost._id}`);
  };

  const handleDeletePost = (postId, blogType) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post._id !== postId));
      navigate(`/blog/${blogType}`);
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
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Failed to fetch posts:", err));
  }, []);

  useEffect(() => {
    // Apply theme based on the current page path
    const postId = location.pathname.split('/')[2];
    if (location.pathname.includes('/blog/willow') || (location.pathname.startsWith('/post/') && posts.find(p => p._id === postId)?.blogType === 'willow')) {
      document.body.setAttribute('data-theme', 'willow');
    } else if (location.pathname.includes('/blog/wishes') || (location.pathname.startsWith('/post/') && posts.find(p => p._id === postId)?.blogType === 'wishes')) {
      document.body.setAttribute('data-theme', 'wishes');
    } else {
      // For all other pages, use the light/dark theme state
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme, location.pathname, posts]);

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
              element={<ProtectedRoute><CreatePostPage blogType="willow" onAddPost={handleAddPost} /></ProtectedRoute>}
            />
            <Route 
              path="/create-post/wishes"
              element={<ProtectedRoute><CreatePostPage blogType="wishes" onAddPost={handleAddPost} /></ProtectedRoute>}
            />
            <Route 
              path="/post/:postId"
              element={<PostDetailPage posts={posts} onDelete={handleDeletePost} auth={auth} />}
            />
            <Route 
              path="/edit-post/:postId"
              element={
                <ProtectedRoute>
                  <EditPostPage 
                    posts={posts} 
                    onUpdatePost={handleUpdatePost} 
                  />
                </ProtectedRoute>
              }
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
