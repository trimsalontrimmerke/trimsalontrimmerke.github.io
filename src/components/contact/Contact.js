import React, {useEffect}from 'react';
import './Contact.css';  // Import styles for the Alert component
import Mededeling from './mededeling/Mededeling';
import Info from './info/Info';
import Form from './form/form';


function Contact() {
  useEffect(() => {
    // Update the page title dynamically
    document.title = "Contact"; // Set your desired title here
  }, []); 
    const backgroundImage = `${process.env.PUBLIC_URL}/img/Achtergrond2.jpg`;
  return (
   
    <div
    className="background-container-contact"
    style={{ backgroundImage: `url(${backgroundImage})` }}

  >
    <Mededeling />
    <Info /> 
    <Form />
    </div>


  );
}

export default Contact;