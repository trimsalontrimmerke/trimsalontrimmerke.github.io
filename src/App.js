import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Regels from './components/regels/Regels';
import Contact from './components/contact/contact';
import Fotos from './components/fotos/Fotos';
import Success from './components/success/Success';
import Footer from './components/footer/Footer';
import './App.css'; // Make sure to import your main CSS

function App() {
  return (
    <Router basename="/"> {/* Ensure this matches your GitHub Pages path */}
      <div className="app-container"> {/* Added flex container class */}
        <Header />
        <div className="content"> {/* Added content wrapper */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/regels" element={<Regels />} />
            <Route path="/fotos" element={<Fotos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;