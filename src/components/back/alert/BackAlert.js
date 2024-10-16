import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import API_URL from '../../../config/config'; // Make sure this is your API config
import BackNav from '../nav/BackNav';
import './BackAlert.css';


const BackAlert = () => {
  const [alertData, setAlertData] = useState({ text: '', show: false });
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [newShow, setNewShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userToken, setUserToken] = useState(null); // Store the Firebase Auth token
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const auth = getAuth();

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token); // Save Firebase Auth token
        setIsLoggedIn(true); // Set login state
        fetchAlertData(token); // Fetch alert data
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch the current alert from the backend
  const fetchAlertData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}medeling`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Pass the Firebase Auth token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alert data');
      }

      const data = await response.json();
      setAlertData(data);
      setNewText(data.text);
      setNewShow(data.show);
    } catch (error) {
      setErrorMessage('Error fetching alert data.');
    } finally {
      setLoading(false);
    }
  };

  // Update the alert data in the backend
  const handleUpdateAlert = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}medeling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}` // Pass the Firebase Auth token
        },
        body: JSON.stringify({
          text: newText,
          show: newShow
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update alert');
      }

      const updatedAlert = await response.json();
      setAlertData(updatedAlert);
      setSuccessMessage('Alert updated successfully!');
    } catch (error) {
      setErrorMessage('Error updating alert.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <p>Please log in to update the alert.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <BackNav />
      <div className="BackAlert-container">
      <div className="BackAlert-content">
        <h2 className="BackAlert-title">Admin - Update Alert</h2>
        {successMessage && <p className="BackAlert-success-message">{successMessage}</p>}
        {errorMessage && <p className="BackAlert-error-message">{errorMessage}</p>}
  
        <div className="BackAlert-input-group">
          <label className="BackAlert-label">
            Alert Message:
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="BackAlert-input"
            />
          </label>
        </div>
  
        <div className="BackAlert-input-group">
          <label className="BackAlert-label">
            Show Alert:
            <input
              type="checkbox"
              checked={newShow}
              onChange={(e) => setNewShow(e.target.checked)}
              className="BackAlert-checkbox"
            />
            <span className="BackAlert-checkbox-custom"></span>
          </label>
        </div>
  
        <button onClick={handleUpdateAlert} className="BackAlert-update-button">
          Update Alert
        </button>
      </div>
    </div>
    </div>
  );
  
};

export default BackAlert;
