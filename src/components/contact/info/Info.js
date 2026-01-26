import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography } from 'antd';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import './Info.css';
import { ClockCircleOutlined } from '@ant-design/icons';


const contactItems = [
  {
    icon: `${process.env.PUBLIC_URL}/img/pin.png`,
    title: "Adres",
    content: (
      <a href="https://www.google.com/maps/search/?api=1&query=Proostdiestraat+15,+8980+Beselare" 
         target="_blank" 
         rel="noopener noreferrer">
        Proostdiestraat 15<br />8980 Beselare
      </a>
    )
  },
  {
    icon: `${process.env.PUBLIC_URL}/img/telephone icon.png`,
    title: "Telefoon",
    content: <a href="tel:+32468432523">+32 468 43 25 23</a>
  },
  {
    icon: `${process.env.PUBLIC_URL}/img/envelope icon.png`,
    title: "Email",
    content: <a href="mailto:info@trimsalontrimmerke.be">info@trimsalontrimmerke.be</a>
  }
];

function Info() {
  const [openingHours, setOpeningHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpeningHours = async () => {
      try {
        const openingstijdenRef = doc(db, "openingstijden", "weeklyHours");
        const docSnap = await getDoc(openingstijdenRef);
        if (docSnap.exists()) setOpeningHours(docSnap.data());
        else setError("No opening hours found.");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOpeningHours();
  }, []);

  const daysOfWeek = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];

  return (
   
    <div className="modern-info-container">
      <div className="info-grid">
        <div className="contact-grid">
          {/* Top row with phone and email side by side */}
          <div className="top-row">
            {contactItems.filter(item => item.title !== "Adres").map((item, index) => (
              <div key={index} className="info-card">
                <div className="info-card-content">
                  <img alt={item.title} src={item.icon} className="card-icon" />
                  <div className="card-text">
                    <h3 className="card-title">{item.title}</h3>
                    <div className="card-content">{item.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Address card */}
          {contactItems.filter(item => item.title === "Adres").map((item, index) => (
            <div key={index} className="info-card">
              <div className="info-card-content">
                <img alt={item.title} src={item.icon} className="card-icon" />
                <div className="card-text">
                  <h3 className="card-title">{item.title}</h3>
                  <div className="card-content">{item.content}</div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Google Maps embed */}
          <div className="map-container">
            <iframe 
              title='Locatie van het trimsalon'
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.215096678593!2d3.020787315746253!3d50.85436657953443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c33a8a1c3e9d8f%3A0x1c1a1b1b1b1b1b1b!2sProostdiestraat%2015%2C%208980%20Beselare%2C%20Belgium!5e0!3m2!1sen!2sbe!4v1620000000000!5m2!1sen!2sbe" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy">
            </iframe>
          </div>
        </div>
        
        <Card className="hours-card" hoverable>
          <Card.Meta
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8, color: '#3b82f6' }} />
                Openingsuren
              </span>
            }
          />
          {loading ? <Spin /> : error ? <p>{error}</p> : (
            <div className="hours-list">
              {daysOfWeek.map(day => {
                const hours = openingHours?.[day];
                return (
                  <div key={day} className="hour-item">
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                    <span>
                      {hours?.isClosed ? 'Gesloten' : hours ? `${hours.open} - ${hours.close}` : 'Onbekend'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
export default Info; 