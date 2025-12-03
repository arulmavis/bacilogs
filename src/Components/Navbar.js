// src/Components/Navbar.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './navbar.css';

// A simple map to associate emails with author names
const authorNameMap = {
  'ardaulker24@gmail.com': 'Arül',
  'gizemy213@gmail.com': 'Gizemeh',
};

const Navbar = ({ theme, setTheme, currentUser, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/"><span className="logo-baci">Bacı</span><span className="logo-logs">logs</span></NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/news">News</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
      <div className="navbar-right">
        {currentUser ? ( // If a user is logged in...
          <>
            {/* Look up the custom name, or fall back to Firebase's displayName or email */}
            <span className="navbar-username">
              Welcome, {authorNameMap[currentUser.email] || currentUser.displayName || currentUser.email}!
            </span>
            <button onClick={onLogout} className="navbar-button logout-button">Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbar-button login-button">
            Login
          </Link>
        )}
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </nav>
  );
};

export default Navbar;