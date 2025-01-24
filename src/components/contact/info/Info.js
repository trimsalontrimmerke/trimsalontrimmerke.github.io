import React, { useState, useEffect } from 'react';
import './Info.css'; // Import styles for the Info component
import { db } from '../../../firebaseConfig'; // Make sure your firebaseConfig is set up correctly
import { doc, getDoc } from "firebase/firestore"; // Firestore functions to get document

const pinIcon = `${process.env.PUBLIC_URL}/img/pin.png`;
const phoneIcon = `${process.env.PUBLIC_URL}/img/telephone icon.png`;
const envelopeIcon = `${process.env.PUBLIC_URL}/img/envelope icon.png`;

function Info() {
  // Step 1: Set up state to store the opening hours and loading state
  const [openingHours, setOpeningHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2: Fetch the opening hours from Firebase Firestore when the component mounts
  useEffect(() => {
    const fetchOpeningHours = async () => {
      try {
        const openingstijdenRef = doc(db, "openingstijden", "weeklyHours"); // Get the 'weeklyHours' document from Firestore
        const docSnap = await getDoc(openingstijdenRef);

        if (docSnap.exists()) {
          setOpeningHours(docSnap.data());
        } else {
          setError("No opening hours found.");
        }
      } catch (error) {
        console.error("Error fetching opening hours:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpeningHours();
  }, []);

  // Step 3: Define the order of the days of the week
  const daysOfWeek = [
    'maandag',
    'dinsdag',
    'woensdag',
    'donderdag',
    'vrijdag',
    'zaterdag',
    'zondag',
  ];

  return (
    <div className="above-form-container">
      <div className="layout-row">
        <div className="left-column">
          <div className="left-item">
            <p><img src={pinIcon} alt="pin icon" className="icon" /></p>
            <a href="https://www.google.com/maps/search/?api=1&query=Proostdiestraat+15,+8980+Beselare" target="_blank" rel="noopener noreferrer" className="address-link">
              Proostdiestraat 15<br />
              8980 Beselare
            </a>
          </div>
          <div className="left-item">
            <p><img src={phoneIcon} alt="telephone icon" className="icon" /></p>
            <a href="tel:+32468432523" className="phone-link">+32 468 43 25 23</a>
          </div>
          <div className="left-item left-item-last">
            <p><img src={envelopeIcon} alt="envelope icon" className="icon" /></p>
            <a href="mailto:info@trimsalontrimmerke.be" className="phone-link">info&#64;trimsalontrimmerke.be</a>
          </div>
        </div>
        <div className="right-column">
          <div className="right-item">
            <h1>Openingsuren</h1>
            {loading && <p>Loading opening hours...</p>}
            {error && <p>Error fetching opening hours: {error}</p>}
            {openingHours && (
              <div>
                {daysOfWeek.map(day => {
                  const hours = openingHours[day];
                  if (hours && hours.isClosed) {
                    return <p key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}: Gesloten</p>;
                  } else if (hours) {
                    return (
                      <p key={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}: {hours.open} - {hours.close}
                      </p>
                    );
                  } else {
                    return <p key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}: No data available</p>;
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
