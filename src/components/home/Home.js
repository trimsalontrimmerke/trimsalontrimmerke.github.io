import React from 'react';
import { Button, Typography } from 'antd';
import './Home.css';
import Alert from './alert/Alert';
import Fotohome from './fotohome/Fotohome';
import Over from './over/Over';
import Carousel from '../carousel/LazyCarousel.js';
import PageSEO from '../PageSEO.js'
import LazyCarousel from '../carousel/LazyCarousel.js';

const { Title, Text, Paragraph } = Typography;

function Home() {
  return (
    <div className="home">
        <PageSEO page="home" />

      <Alert />
      
      {/* Hero Section */}
      <div className="hero-container">
        <Fotohome />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Title className="hero-title">Welkom bij 't Trimmerke</Title>
          <Text className="hero-subtitle">
            Uw specialist voor hondentrimmen, hondenbaden en vachtverzorging in Beselare en omstreken.
          </Text>
          <div className="hero-buttons">
            <Button type="primary" size="large" href="#about">
              Meer over mij
            </Button>
            <Button size="large" href="#gallery">
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
          Ontdek hoe wij te werk gaan: van een rustig welkom tot een grondige verzorging. 
          Elk dier krijgt persoonlijke aandacht in ons knusse trimsalon in Beselare.
        </Paragraph>
        <LazyCarousel />
        
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: '20px' }}>Bekijk ook onze tevreden klanten</Title>
          <Button type="primary" size="large" href="/fotos">
            Foto's van klanten
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;