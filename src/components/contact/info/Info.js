import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography } from 'antd';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import './Info.css';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
        <div className="contact-cards">
          {contactItems.map((item, index) => (
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