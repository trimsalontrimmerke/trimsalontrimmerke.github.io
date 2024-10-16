import React, { useState, useEffect } from 'react';
import './Alert.css'; // Import styles for the Alert component
import API_URL from '../../../config/config'; // Ensure this path is correct

function Alert() {
  // Step 1: Set up state to store the alert message and loading state
  const [alertMessage, setAlertMessage] = useState('');
  const [show, setShow] = useState(false);

  // Step 2: Fetch data from the API
  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const response = await fetch(`${API_URL}medeling`);

        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json(); // Parse JSON

        // Check if the response has the expected properties
        if (data && data.text) {
          setAlertMessage(data.text); // Update state with the alert text
          setShow(data.show); // Show the alert message
        } else {
          throw new Error('No alert message found in the response.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlertData(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  if (!show) return null;

  return (
    <div className="alert-box">
      {alertMessage} {/* Display the alert message */}
    </div>
  );
}

export default Alert;
