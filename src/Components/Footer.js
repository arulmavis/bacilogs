// src/Components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">©{year} Bacılogs... All rights reserved.</footer>
  );
};

export default Footer;