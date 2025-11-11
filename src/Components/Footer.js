// src/Components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">©{year} Bacılogs by you and your best friend. All rights reserved.</footer>
  );
};

export default Footer;