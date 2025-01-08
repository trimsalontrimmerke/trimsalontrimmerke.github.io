import React, { useState, useEffect } from 'react';
import './Alert.css'; // Import styles for the Alert component
import { db } from '../../../firebaseConfig'; // Import Firebase configuration
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods to get data

function Alert() {
  // Step 1: Set up state to store the alert message and loading state
  const [alertMessage, setAlertMessage] = useState('');
  const [show, setShow] = useState(false);

  // Step 2: Fetch alert data from Firebase Firestore
  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const medelingRef = doc(db, 'medeling', 'current'); // Reference to the 'current' document in the 'medeling' collection
        const docSnap = await getDoc(medelingRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAlertMessage(data.text); // Set alert text
          setShow(data.show); // Set whether to show the alert
        } else {
          console.error('No alert found in Firestore.');
        }
      } catch (error) {
        console.error('Error fetching alert:', error);
      }
    };

    fetchAlertData(); // Fetch alert data from Firebase when the component mounts
  }, []); // Empty dependency array to run once on mount

  // If `show` is false, don't render the alert
  if (!show) return null;

  return (
    <div className="alert-box">
      {alertMessage} {/* Display the alert message */}
    </div>
  );
}

export default Alert;
