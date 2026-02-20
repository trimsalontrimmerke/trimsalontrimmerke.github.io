import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Header from './components/header/Header';
import Home from './components/home/Home';
import Regels from './components/regels/Regels';
import Contact from './components/contact/Contact';
import Fotos from './components/fotos/Fotos';
import Success from './components/success/Success';
import Footer from './components/footer/Footer';
import ScrollToTop from './ScrollToTop';
import './App.css';

// Lazy load admin routes
const Login = loadable(() => import('./components/back/login/login'));
const BackAlert = loadable(() => import('./components/back/alert/BackAlert'));
const BackOpeningHours = loadable(() => import('./components/back/openingsuren/BackOpening'));
const BackFotos = loadable(() => import('./components/back/fotos/BackFotos'));
const BackCarousel = loadable(() => import('./components/back/carousel/BackCarousel'));
const BackCadeau = loadable(() => import('./components/back/Cadeau/BackCadeau'));
const NotFound = loadable(() => import('./components/notFound/NotFound'));

function App() {
  return (
    <Router basename="/">
      <ScrollToTop />
      <div className="app-container">
        <Header />
        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/regels" element={<Regels />} />
            <Route path="/fotos" element={<Fotos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />

            {/* Admin routes (lazy loaded) */}
            <Route path="/login" element={<Login />} />
            <Route path="/back/alert" element={<BackAlert />} />
            <Route path="/back/openingsuren" element={<BackOpeningHours />} />
            <Route path="/back/fotos" element={<BackFotos />} />
            <Route path="/back/carousel" element={<BackCarousel />} />
            <Route path="/back/cadeau" element={<BackCadeau />} />

            {/* 404 - catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;