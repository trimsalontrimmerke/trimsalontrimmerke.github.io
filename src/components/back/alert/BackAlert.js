import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig'; // Ensure this path is correct
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './BackAlert.css';
import BackNav from '../nav/BackNav';
import useAuth from '../../../hooks/useAuth'; // Import the custom useAuth hook

const BackAlert = () => {
  const [alertData, setAlertData] = useState({ text: '', show: false });
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [newShow, setNewShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { isLoggedIn, loading: authLoading, errorMessage: authError } = useAuth(); // Use the custom hook

   useEffect(() => {
          if (isLoggedIn) {
              fetchAlertData(); 
          }
      }, [isLoggedIn]);
  // Fetch the current alert from Firestore
  const fetchAlertData = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const medelingRef = doc(db, 'medeling', 'current'); // Reference to 'current' document
      const docSnap = await getDoc(medelingRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAlertData(data);
        setNewText(data.text);
        setNewShow(data.show);
      } else {
        setErrorMessage('No alert data found in Firestore.');
      }
    } catch (error) {
      setErrorMessage('Error fetching alert data.');
    } finally {
      setLoading(false);
    }
  };

  // Update the alert data in Firestore
  const handleUpdateAlert = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const medelingRef = doc(db, 'medeling', 'current'); // Reference to 'current' document
      const updatedMedeling = {
        text: newText,
        show: newShow,
      };

      await updateDoc(medelingRef, updatedMedeling); // Update the document in Firestore
      setAlertData(updatedMedeling);
      setSuccessMessage('Alert updated successfully!');
    } catch (error) {
      setErrorMessage('Error updating alert.');
    } finally {
      setLoading(false);
    }
  };

  // Handle the case where the user is not logged in or authentication is still loading
  if (authLoading) {
    return <p>Loading authentication...</p>;
  }

  if (!isLoggedIn) {
    return <p>Please log in to update the alert.</p>;
  }

  // Handle loading the alert data
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
