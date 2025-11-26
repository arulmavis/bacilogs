import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// A simple map to associate emails with author names
const authorNameMap = { // Replace these placeholder emails with actual emails used in Firebase Auth
  'ardaulker24@gmail.com': 'Arül',
  'gizemeh@example.com': 'Gizemeh',
};

function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Get the author's name from the map, or default to the email if not found
  const authorName = authorNameMap[currentUser?.email] || currentUser?.email;

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome, {authorName}!</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default DashboardPage;