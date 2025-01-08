import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import BackNav from '../nav/BackNav';
import './BackOpening.css';
import useAuth from '../../../hooks/useAuth';  // Import the custom hook

const BackOpeningHours = () => {
  const [hoursData, setHoursData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { userToken, isLoggedIn, loading: authLoading, errorMessage: authError } = useAuth(); // Use the custom hook
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    if (isLoggedIn) {
      fetchOpeningHours(); // Fetch opening hours data when logged in
    }
  }, [isLoggedIn]);

  const fetchOpeningHours = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'openingstijden', 'weeklyHours');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHoursData(docSnap.data());
      } else {
        setErrorMessage('Opening hours data not found.');
      }
    } catch (error) {
      setErrorMessage('Error fetching opening hours data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHours = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'openingstijden', 'weeklyHours');
      await setDoc(docRef, hoursData, { merge: true });
      setSuccessMessage('Opening hours updated successfully!');
    } catch (error) {
      setErrorMessage('Error updating opening hours.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (day, field, value) => {
    setHoursData((prevData) => ({
      ...prevData,
      [day]: {
        ...prevData[day],
        [field]: value,
      },
    }));
  };

  const daysOrder = [
    'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'
  ];

  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return <p>Please log in to update the opening hours.</p>;
  }

  if (loading) {
    return <p>Loading opening hours...</p>;
  }

  return (
    <div>
      <BackNav />
      <div className="BackOpeningstijden-container">
        <div className="BackOpeningstijden-content">
          <h2 className="BackOpeningstijden-title">Admin - Update Opening Hours</h2>
          {successMessage && <p className="BackOpeningstijden-success-message">{successMessage}</p>}
          {errorMessage && <p className="BackOpeningstijden-error-message">{errorMessage}</p>}

          <div className="BackOpeningstijden-days">
            {daysOrder.map((day) => (
              <div key={day} className="BackOpeningstijden-day-section">
                <h3 className="BackOpeningstijden-day-title">{day.charAt(0).toUpperCase() + day.slice(1)}</h3>

                {/* Show Open and Close time fields only if "isClosed" is unchecked */}
                {!hoursData[day]?.isClosed && (
                  <>
                    <label className="BackOpeningstijden-label">
                      Open:
                      <input
                        type="time"
                        value={hoursData[day]?.open || ''}
                        onChange={(e) => handleInputChange(day, 'open', e.target.value)}
                        className="BackOpeningstijden-input"
                      />
                    </label>

                    <label className="BackOpeningstijden-label">
                      Close:
                      <input
                        type="time"
                        value={hoursData[day]?.close || ''}
                        onChange={(e) => handleInputChange(day, 'close', e.target.value)}
                        className="BackOpeningstijden-input"
                      />
                    </label>
                  </>
                )}

                <label className="BackOpeningstijden-label">
                  Closed:
                  <input
                    type="checkbox"
                    checked={hoursData[day]?.isClosed || false}
                    onChange={(e) => handleInputChange(day, 'isClosed', e.target.checked)}
                    className="BackOpeningstijden-checkbox"
                  />
                  <span className="BackOpeningstijden-checkbox-custom"></span>
                </label>
              </div>
            ))}
          </div>

          <button onClick={handleUpdateHours} className="BackOpeningstijden-update-button">
            Update Opening Hours
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackOpeningHours;
