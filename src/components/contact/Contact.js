import React, { useEffect } from 'react';
import { Layout } from 'antd';
import Mededeling from './mededeling/Mededeling';
import Info from './info/Info';
import Form from './form/Form';
import './Contact.css';

const { Content } = Layout;

function Contact() {
  useEffect(() => {
    document.title = "Contact | Trimsalon Trimmerke";
     if (window.location.hash === '#formulier') {
      const formElement = document.getElementById('formulier');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.2)), url(${process.env.PUBLIC_URL}/img/Achtergrond2.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <Layout 
      className="modern-contact-layout" 
      style={backgroundStyle}
    >
      <Content className="contact-content">
        <Mededeling />
        <Info />
           <div id="formulier">
            <Form />
           </div>
      
      </Content>
    </Layout>
  );
}

export default Contact;