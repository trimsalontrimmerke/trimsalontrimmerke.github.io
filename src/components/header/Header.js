import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        {/* Logo - Left side */}
        <Link to="/home" className="logo-link" onClick={closeMenu}>
          <img 
            className="logo" 
            src={`${process.env.PUBLIC_URL}/img/logo.jpg`} 
            alt="Trimsalon Logo" 
          />
        </Link>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <MenuOutlined />
        </button>

        {/* Navigation links - Centered */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link className="nav-link" to="/home" onClick={closeMenu}>
            Home
          </Link>
          <Link className="nav-link" to="/regels" onClick={closeMenu}>
            Huisregels
          </Link>
          <Link className="nav-link" to="/fotos" onClick={closeMenu}>
            Foto's
          </Link>
          <Link className="nav-link" to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </div>

        {/* Social icons - Right side */}
        <div className="social-icons">
          <a 
            href="https://www.facebook.com/profile.php?id=61565857696098" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Facebook"
          >
            <img 
              className="social-icon" 
              src={`${process.env.PUBLIC_URL}/img/facebook.png`} 
              alt="Facebook" 
            />
          </a>
          <a 
            href="https://www.instagram.com/trimsalon_t_trimmerke/" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Instagram"
          >
            <img 
              className="social-icon" 
              src={`${process.env.PUBLIC_URL}/img/insta.png`} 
              alt="Instagram" 
            />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;