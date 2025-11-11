// src/Components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const { theme: urlTheme } = useParams();
  // 1. Read the initial theme from localStorage, or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // The theme from the URL (like 'willow') should always take precedence
    if (urlTheme === 'willow' || urlTheme === 'dark' || urlTheme === 'light') {
      setTheme(urlTheme);
    } else {
      // If no theme in URL, ensure we're using the stored theme
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTheme(storedTheme);
    }
  }, [urlTheme]);

  // 2. Save the theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`App ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;