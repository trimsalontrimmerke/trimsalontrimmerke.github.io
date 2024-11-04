// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../../../firebaseConfig'; // Ensure to import the auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get ID token
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token); // Store token in local storage

      // Redirect to /back/alert after successful login
      navigate('/back/alert');

    } catch (error) {
      setError(error.message); // Update error state
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="Login-container">
      <div className="Login-card">
        <h2 className="Login-title">Login</h2>
        {error && <p className="Login-error-message">{error}</p>}
        <form onSubmit={handleLogin} className="Login-form">
          <div className="Login-form-group">
            <label className="Login-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="Login-input"
            />
          </div>
          <div className="Login-form-group">
            <label className="Login-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="Login-input"
            />
          </div>
          <button type="submit" className="Login-button">Login</button>
        </form>
      </div>
    </div>
  );
  
};

export default Login;
