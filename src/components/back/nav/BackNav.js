// BackNav.js
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './BackNav.css'; // Import the CSS for styling

const BackNav = () => {
  const auth = getAuth();
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the home page after logging out
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="BackNav-nav">
      <ul className="BackNav-ul">
        <li className="BackNav-li" onClick={() => navigate('/back/carousel')}>
          <span className="BackNav-link">Manage Carousel</span>
        </li>
        <li className="BackNav-li" onClick={() => navigate('/back/fotos')}>
          <span className="BackNav-link">Manage Photos</span>
        </li>
        <li className="BackNav-li" onClick={() => navigate('/back/alert')}>
          <span className="BackNav-link">Update Alert</span>
        </li>
        <li className="BackNav-li" onClick={() => navigate('/back/openingsuren')}>
          <span className="BackNav-link">Update Opening Hours</span>
        </li>
        <li className="BackNav-li">
          <button className="BackNav-link BackNav-logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default BackNav;
