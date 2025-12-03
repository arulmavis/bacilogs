// src/App.js
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';
import { useAuth } from './context/AuthContext';

import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import BlogPage from './Pages/BlogPage'; // Import the new BlogPage
import CreatePostPage from './Pages/CreatePostPage'; // Import the new CreatePostPage
import PostDetailPage from './Pages/PostDetailPage'; // Import for viewing a single post
import EditPostPage from './Pages/EditPostPage'; // Import for editing a post
import LoginPage from './Pages/LoginPage'; 
import DashboardPage from './Pages/DashboardPage';
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
  const [postsLoading, setPostsLoading] = useState(true); // Add a loading state for posts
  const { currentUser, loading } = useAuth(); // Assuming useAuth provides a loading state

  // Create a lookup map for post blog types for efficient access
  const postBlogTypeMap = useMemo(() => {
    const map = new Map();
    posts.forEach(post => map.set(post.id, post.blogType));
    return map;
  }, [posts]);

  // Listen for real-time updates from Firestore
  useEffect(() => {
    const postsCollection = collection(db, 'posts');
    
    // onSnapshot returns an unsubscribe function
    const unsubscribe = onSnapshot(postsCollection, (querySnapshot) => {
      const postList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(postList);
      setPostsLoading(false); // Set loading to false once posts are fetched
    }, (err) => {
      console.error("Failed to listen for post updates:", err);
    });

    // Cleanup: unsubscribe when the component unmounts
    return () => unsubscribe();
    
  }, []); // Empty dependency array ensures this sets up the listener once

  // A component to protect routes that require login
  const ProtectedRoute = ({ children }) => {
    // While auth state is loading, show a loading indicator to prevent flicker or premature redirects.
    if (loading) {
      return <div className="page-container"><h1>Loading...</h1></div>; // Display a loading indicator
    }

    if (!currentUser) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    // Apply theme based on the current page path
    const pathParts = location.pathname.split('/');
    const pageType = pathParts[1];
    const entityId = pathParts[2];

    if (location.pathname.includes('/blog/willow') || (pageType === 'post' && postBlogTypeMap.get(entityId) === 'willow')) {
      document.body.setAttribute('data-theme', 'willow');
    } else if (location.pathname.includes('/blog/wishes') || (pageType === 'post' && postBlogTypeMap.get(entityId) === 'wishes')) {
      document.body.setAttribute('data-theme', 'wishes');
    } else {
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme, location.pathname, postBlogTypeMap]);

  // Filter posts for each blog type
  const willowPosts = useMemo(() => posts.filter(p => p.blogType === 'willow'), [posts]);
  const wishesPosts = useMemo(() => posts.filter(p => p.blogType === 'wishes'), [posts]);

  return (
    <div className="App">
      <Navbar theme={theme} setTheme={setTheme} currentUser={currentUser} onLogout={handleLogout} />
      <main>
        <Routes>
          {/* Pass posts to HomePage to display count */}
          <Route path="/" element={<HomePage posts={posts} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/blog/willow" 
              element={<BlogPage 
                blogName="Memorial of a Willow Tree"
                blogType="willow"
                posts={willowPosts}
                isLoading={postsLoading}
              />} 
            />
            <Route 
              path="/blog/wishes" 
              element={<BlogPage 
                blogName="Eyes Hiding Secret Wishes" 
                blogType="wishes"
                posts={wishesPosts}
                isLoading={postsLoading}
              />}
            />
            {/* Protected Routes */}
            <Route 
              path="/create-post/willow"
              element={<ProtectedRoute><CreatePostPage blogType="willow" /></ProtectedRoute>}
            />
            <Route 
              path="/create-post/wishes"
              element={<ProtectedRoute><CreatePostPage blogType="wishes" /></ProtectedRoute>}
            />
            <Route 
              path="/post/:postId"
              element={<PostDetailPage />}
            />
            <Route 
              path="/edit-post/:postId"
              element={
                <ProtectedRoute>
                  <EditPostPage />
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
