// src/components/success/Success.js
import React from 'react';
import './Success.css'; // Import the CSS for this component

const Success = () => {
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/Achtergrond2.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <div className="success-above-form-container">
        <div className="success-layout-row">
          <div className="success-left-column">
            {/* Left column can be used for additional content in the future */}
          </div>
          <div className="success-right-column">
            <div className="success-right-item">
              <h1>Email verzonden</h1>
              <p>We antwoorden zo snel mogelijk!</p>
              <p>Dit kan 2 werkdagen duren.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
