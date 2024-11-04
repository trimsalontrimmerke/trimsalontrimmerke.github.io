import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear(); // Dynamically get the current year
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          &copy; {currentYear} - &rsquo;t Trimmerke - btw: BE1013798369 - Made By Lukas Carton
        </p>
      </div>
    </footer>
  );
}

export default Footer;