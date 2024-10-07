import React from 'react';
import './Info.css';  // Import styles for the Info component

const pinIcon = `${process.env.PUBLIC_URL}/img/pin.png`;
const phoneIcon = `${process.env.PUBLIC_URL}/img/telephone icon.png`;
const envelopeIcon = `${process.env.PUBLIC_URL}/img/envelope icon.png`;

function Info() {
  return (
    <div className="above-form-container">
      <div className="layout-row">
        <div className="left-column">
          <div className="left-item">
            <p><img src={pinIcon} alt="pin icon" className="icon" /></p>
            <a href="https://www.google.com/maps/search/?api=1&query=Proostdiestraat+15,+8980+Beselare" target="_blank" className="address-link">
              Proostdiestraat 15<br/>
              8980 Beselare
            </a>
          </div>
          <div className="left-item">
            <p><img src={phoneIcon} alt="telephone icon" className="icon" /></p>
            <a href="tel:+32468432523" className="phone-link">+32 468 43 25 23</a>
          </div>
          <div className="left-item left-item-last">
            <p><img src={envelopeIcon} alt="envelope icon" className="icon" /></p>
            <a href="mailto:trimmerke@outlook.com" className="phone-link">trimmerke&#64;outlook.com</a>
          </div>
        </div>
        <div className="right-column">
          <div className="right-item">
            <h1>openingsuren</h1>
            <p>maandag: gesloten</p>
            <p>dinsdag: gesloten</p>
            <p>woensdag: 8u - 18u30</p>
            <p>donderdag: 8u - 18u30</p>
            <p>vrijdag: gesloten</p>
            <p>zaterdag: 8u -18u30</p>
            <p>zondag: gesloten</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
