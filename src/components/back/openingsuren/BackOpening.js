import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import API_URL from '../../../config/config'; // Make sure this is your API config

const BackOpeningHours = () => {
  const [hoursData, setHoursData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userToken, setUserToken] = useState(null); // Store Firebase Auth token
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const auth = getAuth();

  // Fetch the current opening hours
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token); // Save Firebase Auth token
        setIsLoggedIn(true); // Set login state
        fetchOpeningHours(token); // Fetch opening hours data
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch the opening hours data from the backend
  const fetchOpeningHours = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}openingstijden`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Pass the Firebase Auth token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch opening hours data');
      }

      const data = await response.json();
      setHoursData(data);
    } catch (error) {
      setErrorMessage('Error fetching opening hours data.');
    } finally {
      setLoading(false);
    }
  };

  // Update the opening hours data in the backend
  const handleUpdateHours = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}openingstijden`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}` // Pass the Firebase Auth token
        },
        body: JSON.stringify(hoursData) // Send updated hours data
      });

      if (!response.ok) {
        throw new Error('Failed to update opening hours');
      }

      const updatedHours = await response.json();
      setHoursData(updatedHours);
      setSuccessMessage('Opening hours updated successfully!');
    } catch (error) {
      setErrorMessage('Error updating opening hours.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for open, close, and isClosed
  const handleInputChange = (day, field, value) => {
    setHoursData((prevData) => ({
      ...prevData,
      [day]: {
        ...prevData[day],
        [field]: value
      }
    }));
  };

  // Day order array for proper rendering
  const daysOrder = [
    'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'
  ];

  if (!isLoggedIn) {
    return <p>Please log in to update the opening hours.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Admin - Update Opening Hours</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div>
        {daysOrder.map((day) => (
          <div key={day} className="day-section">
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>

            {/* Show Open and Close time fields only if "isClosed" is unchecked */}
            {!hoursData[day]?.isClosed && (
              <>
                <label>
                  Open:
                  <input
                    type="time"
                    value={hoursData[day]?.open || ''}
                    onChange={(e) => handleInputChange(day, 'open', e.target.value)}
                  />
                </label>

                <label>
                  Close:
                  <input
                    type="time"
                    value={hoursData[day]?.close || ''}
                    onChange={(e) => handleInputChange(day, 'close', e.target.value)}
                  />
                </label>
              </>
            )}

            <label>
              Closed:
              <input
                type="checkbox"
                checked={hoursData[day]?.isClosed || false}
                onChange={(e) => handleInputChange(day, 'isClosed', e.target.checked)}
              />
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleUpdateHours} className="update-button">
        Update Opening Hours
      </button>
    </div>
  );
};

export default BackOpeningHours;
