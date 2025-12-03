// src/Components/Navbar.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './navbar.css';

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
        {currentUser ? (
          <>
            <NavLink to="/dashboard" className="navbar-button">Dashboard</NavLink>
            <span className="navbar-username">Welcome, {currentUser.displayName || currentUser.email}!</span>
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