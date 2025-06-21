import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Importeer react-helmet
import Header from './components/header/Header';
import Home from './components/home/Home';
import Regels from './components/regels/Regels';
import Contact from './components/contact/Contact';
import Fotos from './components/fotos/Fotos';
import Success from './components/success/Success';
import Footer from './components/footer/Footer';
import Login from './components/back/login/login';
import BackAlert from './components/back/alert/BackAlert';
import BackOpeningHours from './components/back/openingsuren/BackOpening';
import BackFotos from './components/back/fotos/BackFotos';
import BackCarousel from './components/back/carousel/BackCarousel';
import './App.css'; // Zorg ervoor dat je je CSS goed importeert
import ScrollToTop from './ScrollToTop';

function App() {
  return (
    <Router basename="/">
       <ScrollToTop /> 
      <div className="app-container">
        <Header />
        <div className="content">
          <Routes>
            {/* Home Route */}
            <Route
              path="/"
              element={
                <>
                  <Helmet>
                    <title>trimsalon &rsquo;t trimmerke</title>
                    <meta
                      name="description"
                      content="Welkom bij Trimsalon 't trimmerke , het professionele hondensalon in Beselare. Wij bieden hondenverzorging, knippen, trimmen en hondenbaden."
                    />
                    <meta
                      name="keywords"
                      content="hondensalon, trimsalon , trimsalon beselare , hondenkapper, hondenverzorging, hondenbaden, hondensalon in beselare, hondenharen knippen"
                    />
                    <meta name="robots" content="index, follow" />
                  </Helmet>
                  <Home />
                </>
              }
            />

            {/* Regels Route */}
            <Route
              path="/regels"
              element={
                <>
                  <Helmet>
                    <title>trimsalon &rsquo;t trimmerke - Regels & Voorwaarden</title>
                    <meta
                      name="description"
                      content="Bekijk de regels en voorwaarden van trimsalon 't trimmerke voor onze hondensalon diensten."
                    />
                  </Helmet>
                  <Regels />
                </>
              }
            />

            {/* Fotos Route */}
            <Route
              path="/fotos"
              element={
                <>
                  <Helmet>
                    <title>trimsalon &rsquo;t trimmerke - Foto's van Onze blije klantjes</title>
                    <meta
                      name="description"
                      content="Bekijk foto's van onze blije klantjes. Bekijk het werk van trimsalon &rsquo;t trimmerke."
                    />
                  </Helmet>
                  <Fotos />
                </>
              }
            />

            {/* Contact Route */}
            <Route
              path="/contact"
              element={
                <>
                  <Helmet>
                    <title>trimsalon &rsquo;t trimmerke - Contact </title>
                    <meta
                      name="description"
                      content="Neem contact op met trimsalon &rsquo;t trimmerke voor meer informatie over onze hondenverzorging diensten of maak een afspraak."
                    />
                    <meta name="robots" content="index, follow" />
                  </Helmet>
                  <Contact />
                </>
              }
            />

            {/* Success Route */}
            <Route
              path="/success"
              element={
                <>
                  <Helmet>
                    <title>trimsalon &rsquo;t trimmerke - Success</title>
                    <meta
                      name="description"
                      content="Bedankt voor uw vraag"
                    />
                  </Helmet>
                  <Success />
                </>
              }
            />

            {/* Back Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/back/alert" element={<BackAlert />} />
            <Route path="/back/openingsuren" element={<BackOpeningHours />} />
            <Route path="/back/fotos" element={<BackFotos />} />
            <Route path="/back/carousel" element={<BackCarousel />} />

            {/* Catch-All Route */}
            <Route path="*"element={
                <>
                  <Helmet>
                    <title>trimsalon &rsquo;t trimmerke</title>
                    <meta
                      name="description"
                      content="Welkom bij Trimsalon 't trimmerke , het professionele hondensalon in Beselare. Wij bieden hondenverzorging, knippen, trimmen en hondenbaden."
                    />
                    <meta
                      name="keywords"
                      content="hondensalon, trimsalon , trimsalon beselare , hondenkapper, hondenverzorging, hondenbaden, hondensalon in beselare, hondenharen knippen"
                    />
                    <meta name="robots" content="index, follow" />
                  </Helmet>
                  <Home />
                </>
              } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
