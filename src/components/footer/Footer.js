import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaDog, FaCalendarAlt, FaQuestionCircle } from 'react-icons/fa';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Column */}
        <div className="footer-column">
          <h3 className="footer-title">Over Trimsalon 't Trimmerke</h3>
          <p style={{ color: 'rgba(245, 245, 245, 0.8)', lineHeight: '1.6', marginBottom: '20px' }}>
            Professioneel hondentrimsalon met persoonlijke aanpak voor uw trouwe viervoeter.
          </p>
          
          <ul className="footer-links-list">
            <li className="footer-links-item">
              <div className="footer-contact-item">
                <FaDog size={18} />
                <span>Alle hondenrassen welkom</span>
              </div>
            </li>
            <li className="footer-links-item">
              <div className="footer-contact-item">
                <FaCalendarAlt size={18} />
                <span>Op afspraak via telefoon</span>
              </div>
            </li>
          </ul>
          
          <div className="footer-social-links">
            <a href="https://www.facebook.com/profile.php?id=61565857696098" target="_blank" rel="noreferrer" className="footer-social-icon">
              <FiFacebook size={20} />
            </a>
            <a href="https://www.instagram.com/trimsalon_t_trimmerke/" target="_blank" rel="noreferrer" className="footer-social-icon">
              <FiInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Contact Column */}
        <div className="footer-column">
          <h3 className="footer-title">Contact & Locatie</h3>
          <div className="footer-contact-info">
            <div className="footer-contact-item">
              <FaPhone size={18} />
              <span>+32 468 43 25 23</span>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope size={18} />
              <span>info@trimsalontrimmerke.be</span>
            </div>
            <div className="footer-contact-item">
              <FaMapMarkerAlt size={18} />
              <span>Proostdiestraat 15 8980 Beselare</span>
            </div>
          </div>
          
          {/* New "Stel een vraag" button */}
           <Link 
        to="/contact#formulier" 
        className="footer-question-button"
      >
        {/* Icoon behouden */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Stel een vraag
      </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Trimsalon 't Trimmerke - btw: BE1013798369 | 
          Gemaakt door <a href="https://www.linkedin.com/in/lukas-carton-174587360" target="_blank" rel="noopener noreferrer" className="footer-bottom-link">Lukas Carton</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;