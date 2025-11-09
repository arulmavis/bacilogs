// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ theme, setTheme }) => {
  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">Bacılogs</NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/news">News</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      <div className="navbar-theme-switcher">
        <label className="switch">
          <input type="checkbox" onChange={handleThemeChange} checked={theme === 'dark'} />
          <span className="slider round"></span>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;
