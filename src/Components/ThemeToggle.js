// src/Components/ThemeToggle.js
import React from 'react';

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch" htmlFor="checkbox">
        <input type="checkbox" id="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
        <div className="slider round"></div>
      </label>
    </div>
  );
};

export default ThemeToggle;