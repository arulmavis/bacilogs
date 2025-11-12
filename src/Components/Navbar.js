// src/Components/Navbar.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './navbar.css';

const Navbar = ({ theme, setTheme }) => {
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
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </nav>
  );
};

export default Navbar;