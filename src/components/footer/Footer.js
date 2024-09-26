import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear(); // Dynamically get the current year
  return (
    <footer className="footer text-muted">
      <div className="container">
        &copy; {currentYear} - &rsquo;t trimmerke - btw 1013.798.369
      </div>
    </footer>
  );
}

export default Footer;