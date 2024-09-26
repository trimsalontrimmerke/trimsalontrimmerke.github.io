// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header'; // Import your Header component
import Footer from './components/footer/Footer';
import Home from './components/home/Home';


const Regels = () => <h2>Huisregels Page</h2>;
const Fotos = () => <h2>Foto's Page</h2>;
const Contact = () => <h2>Contact Page</h2>;

function App() {
  return (
    <Router>
      <div>
        {/* Include the Header component */}
        <Header />

        {/* Define routes for different pages */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/regels" element={<Regels />} />
          <Route path="/fotos" element={<Fotos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
