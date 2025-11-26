// src/App.js
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
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
const AboutPage = () => <div className="page-container"><h1>About Us test</h1></div>;
const NewsPage = () => <div className="page-container"><h1>News</h1></div>;
const ContactPage = () => <div className="page-container"><h1>Contact</h1></div>;

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState('light');
  const [posts, setPosts] = useState([]);
  const { currentUser, loading } = useAuth(); // Assuming useAuth provides a loading state

  // Fetch posts from Firestore when the component first loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts'); // "posts" is your collection name
        const postSnapshot = await getDocs(postsCollection);
        const postList = postSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPosts(postList);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();
  }, []); // The empty dependency array ensures this runs once on mount

  // A component to protect routes that require login
  const ProtectedRoute = ({ children }) => {
    // While auth state is loading, don't render anything to avoid flicker
    if (loading) {
      return null; // Or a loading spinner
    }

    if (!currentUser) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  useEffect(() => {
    // Apply theme based on the current page path
    const pathParts = location.pathname.split('/');
    const postId = pathParts[2]; // Note: Firestore uses `id`, not `_id`
    if (location.pathname.includes('/blog/willow') || (pathParts[1] === 'post' && posts.find(p => p.id === postId)?.blogType === 'willow')) {
      document.body.setAttribute('data-theme', 'willow');
    } else if (location.pathname.includes('/blog/wishes') || (pathParts[1] === 'post' && posts.find(p => p.id === postId)?.blogType === 'wishes')) {
      document.body.setAttribute('data-theme', 'wishes');
    } else {
      // For all other pages, use the light/dark theme state
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme, location.pathname, posts]);

  // Filter posts for each blog type
  const willowPosts = useMemo(() => posts.filter(p => p.blogType === 'willow'), [posts]);
  const wishesPosts = useMemo(() => posts.filter(p => p.blogType === 'wishes'), [posts]);

  return (
    <div className="App">
      <Navbar theme={theme} setTheme={setTheme} />
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
              />} 
            />
            <Route 
              path="/blog/wishes" 
              element={<BlogPage 
                blogName="Eyes Hiding Secret Wishes" 
                blogType="wishes"
                posts={wishesPosts} 
              />}
            />
            {/* Protected Routes */}
            <Route 
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
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
              element={<PostDetailPage posts={posts} />}
            />
            <Route 
              path="/edit-post/:postId"
              element={
                <ProtectedRoute>
                  <EditPostPage 
                    posts={posts}
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
