import React, { useState } from "react";
import emailjs from "emailjs-com"; 
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import './Form.css';  // Import styles for the Alert component

const Form = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    onderwerp: "",
    hondnaam: "",
    ras: "",
    leeftijd: "",
    message: "",
  });

  // State to manage errors
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  
  // Initialize useNavigate hook
  const navigate = useNavigate();

  // Function to handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Simple validation function
  const validate = () => {
    let tempErrors = {};
    if (!formData.naam) tempErrors.naam = "Naam is required";
    if (!formData.email) tempErrors.email = "E-mailadres is required";
    if (!formData.onderwerp) tempErrors.onderwerp = "Onderwerp is required";
    if (!formData.hondnaam) tempErrors.hondnaam = "Naam van de hond is required";
    if (!formData.ras) tempErrors.ras = "Ras van de hond is required";
    if (!formData.leeftijd) tempErrors.leeftijd = "Leeftijd van de hond is required";
    if (!formData.message) tempErrors.message = "Vragen zijn verplicht";
    return tempErrors;
  };

  // Handling form submission and sending via EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Send email using EmailJS
      emailjs
        .send(
          "service_xzv51jn", // Replace with your EmailJS service ID
          "template_bxml3jz", // Replace with your EmailJS template ID
          formData,
          "eLTU-oozx3Gy3kjkz" // Replace with your EmailJS user ID
        )
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            setSuccessMessage("Your message has been sent successfully!");
            setFormData({
              naam: "",
              email: "",
              onderwerp: "",
              hondnaam: "",
              ras: "",
              leeftijd: "",
              message: "",
            }); // Reset form data

            // Redirect to the success page using useNavigate
            navigate('/success'); // Navigate to the success page
          },
          (error) => {
            console.error("FAILED...", error);
            setErrors({ submit: "Failed to send the message. Please try again later." });
          }
        );
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="top-container-form">
    <div className="containerform">
      <h1>Vragen?</h1>
      <p>Stel ze hier!</p>
      <p>Afspraken worden enkel gepland via een telefoontje!</p>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="naam"
              id="Naam"
              value={formData.naam}
              onChange={handleChange}
              required
            />
            <label htmlFor="Naam">uw naam</label>
            <div className="underline"></div>
            {errors.naam && <span className="text-danger">{errors.naam}</span>}
          </div>

          <div className="input-data">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">e-mailadres</label>
            <div className="underline"></div>
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="onderwerp"
              id="onderwerp"
              value={formData.onderwerp}
              onChange={handleChange}
              required
            />
            <label htmlFor="onderwerp">onderwerp</label>
            <div className="underline"></div>
            {errors.onderwerp && (
              <span className="text-danger">{errors.onderwerp}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="hondnaam"
              id="hondnaam"
              value={formData.hondnaam}
              onChange={handleChange}
              required
            />
            <label htmlFor="hondnaam">naam van de hond</label>
            <div className="underline"></div>
            {errors.hondnaam && (
              <span className="text-danger">{errors.hondnaam}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="ras"
              id="ras"
              value={formData.ras}
              onChange={handleChange}
              required
            />
            <label htmlFor="ras">ras van de hond</label>
            <div className="underline"></div>
            {errors.ras && <span className="text-danger">{errors.ras}</span>}
          </div>

          <div className="input-data">
            <input
              type="text"
              name="leeftijd"
              id="leeftijd"
              value={formData.leeftijd}
              onChange={handleChange}
              required
            />
            <label htmlFor="leeftijd">leeftijd van de hond</label>
            <div className="underline"></div>
            {errors.leeftijd && (
              <span className="text-danger">{errors.leeftijd}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="input-data textarea">
            <textarea
              name="message"
              rows="8"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="message">stel uw vraag</label>
            <div className="underline"></div>
            {errors.message && (
              <span className="text-danger">{errors.message}</span>
            )}
          </div>
        </div>

        <div className="form-row submit-btn">
          <div className="input-data">
            <input type="submit" value="verzend" />
          </div>
        </div>

        {/* Displaying a success or error message */}
        {successMessage && <p className="text-success">{successMessage}</p>}
        {errors.submit && <p className="text-danger">{errors.submit}</p>}
      </form>
    </div>
    </div>
  );
};

export default Form;
