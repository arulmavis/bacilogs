// src/Components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
      <div className="theme-switch-wrapper">
        <label className="theme-switch" htmlFor="checkbox">
          <input type="checkbox" id="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
          <div className="slider round"></div>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;