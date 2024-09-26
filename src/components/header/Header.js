// src/components/Header/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Importing the corresponding CSS file

function Header() {
  // State to handle menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle function for the hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav className="navbar">
        <div className={`navcontainer ${isMenuOpen ? 'active' : ''}`}>
          {/* Logo */}
          <Link to="/home">
            <img className="logo" src="/img/logo.jpg" alt="Logo" />
          </Link>

          {/* Hamburger icon (for small screens) */}
          <div className="hamburger" onClick={toggleMenu}>
            &#9776; {/* Hamburger icon */}
          </div>

          {/* Navbar links */}
          <ul className="ul-header">
            <li className="nav-item li-header">
              <Link className="navtext" to="/home">Home</Link>
            </li>
            <li className="nav-item li-header">
              <Link className="navtext" to="/regels">Huisregels</Link>
            </li>
            <li className="nav-item li-header">
              <Link className="navtext" to="/fotos">Foto's</Link>
            </li>
            <li className="nav-item li-header">
              <Link className="navtext" to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Right-side social media links */}
          <div className="right-side-items">
            <a href="https://www.facebook.com/profile.php?id=61565774567395" className="nav-link" target="_blank" rel="noreferrer">
              <img src="/img/facebook.png" alt="Facebook" />
            </a>
            <a href="https://www.instagram.com/marie.stragier/" className="nav-link" target="_blank" rel="noreferrer">
              <img src="/img/insta.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
