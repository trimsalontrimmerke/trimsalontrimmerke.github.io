// src/components/notFound/NotFound.js
import React from 'react';
import { Helmet } from 'react-helmet';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Pagina niet gevonden – Trimsalon 't Trimmerke</title>
        <meta name="robots" content="noindex, follow" />
        <meta
          name="description"
          content="De pagina die u zoekt bestaat niet. Ga terug naar de homepage van Trimsalon 't Trimmerke in Beselare."
        />
      </Helmet>

      <div
        style={{
          padding: '50px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Result
          status="404"
          title="404"
          subTitle="Sorry, de pagina die u probeert te bezoeken bestaat niet of is verplaatst."
          extra={
            <Link to="/">
              <Button type="primary" size="large">
                Terug naar de homepage
              </Button>
            </Link>
          }
        />
      </div>
    </>
  );
};

export default NotFound;