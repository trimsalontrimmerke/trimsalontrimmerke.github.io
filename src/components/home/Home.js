import React, { useEffect } from 'react';
import { Button, Typography } from 'antd';
import './Home.css';
import Alert from './alert/Alert';
import Fotohome from './fotohome/Fotohome';
import Over from './over/Over';
import Carousel from '../carousel/Carousel';

const { Title, Text, Paragraph } = Typography;

function Home() {
  useEffect(() => {
    document.title = "Home | 't Trimmerke";
  }, []);

  return (
    <div className="home">
      <Alert />
      
      {/* Hero Section */}
      <div className="hero-container">
        <Fotohome />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Title className="hero-title">Welkom bij 't Trimmerke</Title>
          <Text className="hero-subtitle">
            Professioneel trimsalon in Beselare
          </Text>
          <div className="hero-buttons">
            <Button 
              type="primary" 
              size="large"
              href="#about"
            >
              Meer over mij
            </Button>
            <Button 
              size="large"
              href="#gallery"
            >
              Onze werkwijze
            </Button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="about-section">
        <Over />
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="gallery-section">
        <Title level={2} className="gallery-title">Onze Werkwijze</Title>
        <Paragraph className="gallery-description">
          Een kijkje achter de schermen bij ons trimsalon.
        </Paragraph>
        <Carousel />
        
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: '20px' }}>Bekijk ook onze tevreden klanten</Title>
          <Button 
            type="primary" 
            size="large"
            href="/fotos"  // Verwijzing naar de foto pagina
          >
            Foto's van klanten
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;