// src/schemas/localBusinessSchema.js
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Trimsalon 't Trimmerke",
  "image": "https://trimsalontrimmerke.be/img/logo.jpg", // corrected URL (removed extra 'h')
  "url": "https://trimsalontrimmerke.be/",
  "telephone": "+32 (0)468 43 25 23",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Proostdiestraat 15",
    "addressLocality": "Beselare",
    "postalCode": "8980",
    "addressCountry": "BE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 50.836571697727535,
    "longitude": 3.014519062625007
  },
  "priceRange": "€€"
};

export default localBusinessSchema;