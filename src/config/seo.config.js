// src/seo.config.js
import localBusinessSchema from '../localBusinessSchema';

const SITE_URL = 'https://trimsalontrimmerke.be';
const SITE_NAME = "Trimsalon 't Trimmerke";
const DEFAULT_OG_IMAGE = `${SITE_URL}/img/logo.jpg`;

const fullUrl = (path = '') => `${SITE_URL}${path}`;

const seoConfig = {
  home: {
    title: `${SITE_NAME} – Professionele hondentrimmer in Beselare`,
    description: "Op zoek naar een betrouwbare hondentrimmer in Beselare? Bij Trimsalon 't Trimmerke verzorgen we uw hond met liefde en vakmanschap. Knippen, baden, ontklitten en advies op maat. Kom langs of maak een afspraak!",
    keywords: "hondentrimmer Beselare, hondensalon Beselare, hondenverzorging, hondenbaden, trimsalon, hondenkapper",
    ogTitle: `${SITE_NAME} – Hondentrimmer in Beselare`,
    ogDescription: "Professionele hondenverzorging in Beselare. Kom kennis maken!",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: fullUrl('/'),
    schema: localBusinessSchema,
  },
  contact: {
    title: `Contact – ${SITE_NAME} in Beselare`,
    description: "Neem contact op met Trimsalon 't Trimmerke voor vragen of een afspraak. Wij zijn gevestigd in Beselare en staan klaar voor u en uw hond.",
    keywords: "contact hondentrimmer Beselare, afspraak maken hondensalon",
    ogTitle: `Contact – ${SITE_NAME}`,
    ogDescription: "Neem contact op met Trimsalon 't Trimmerke in Beselare.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: fullUrl('/contact'),
  },
  fotos: {
    title: `Foto's – ${SITE_NAME} | Blije klantjes in Beselare`,
    description: "Bekijk foto's van onze tevreden klanten. Van kleine tot grote honden, elk dier krijgt een perfecte verzorging in ons trimsalon in Beselare.",
    keywords: "foto's hondentrimmer Beselare, hondensalon resultaten",
    ogTitle: `Foto's van onze blije klantjes – ${SITE_NAME}`,
    ogDescription: "Bekijk het werk van Trimsalon 't Trimmerke in Beselare.",
    ogImage: `${SITE_URL}/img/fotos-og.jpg`,
    canonical: fullUrl('/fotos'),
  },
  regels: {
    title: `Regels & Voorwaarden – ${SITE_NAME}`,
    description: "Lees de regels en voorwaarden van Trimsalon 't Trimmerke in Beselare. Zo weet u wat u kunt verwachten bij uw bezoek.",
    keywords: "regels hondensalon Beselare, voorwaarden hondenverzorging",
    ogTitle: `Regels & Voorwaarden – ${SITE_NAME}`,
    ogDescription: "Bekijk de regels en voorwaarden van ons trimsalon in Beselare.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: fullUrl('/regels'),
  },
  success: {
    title: `Bedankt – ${SITE_NAME}`,
    description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.",
    robots: "noindex, follow",          // ✅ tell search engines not to index
    ogImage: DEFAULT_OG_IMAGE,
    canonical: fullUrl('/success'),
  },
  login: {
    title: `Inloggen – ${SITE_NAME}`,
    robots: "noindex, nofollow",        // ✅ also hide from search
    canonical: fullUrl('/login'),
  },
  // Admin routes – add similar entries for each back-end page
  backAlert: {
    title: `Admin Alert – ${SITE_NAME}`,
    robots: "noindex, nofollow",
    canonical: fullUrl('/back/alert'),
  },
  backOpeningHours: {
    title: `Admin Openingstijden – ${SITE_NAME}`,
    robots: "noindex, nofollow",
    canonical: fullUrl('/back/openingsuren'),
  },
  backFotos: {
    title: `Admin Foto's – ${SITE_NAME}`,
    robots: "noindex, nofollow",
    canonical: fullUrl('/back/fotos'),
  },
  backCarousel: {
    title: `Admin Carousel – ${SITE_NAME}`,
    robots: "noindex, nofollow",
    canonical: fullUrl('/back/carousel'),
  },
  backCadeau: {
    title: `Admin Cadeaubon – ${SITE_NAME}`,
    robots: "noindex, nofollow",
    canonical: fullUrl('/back/cadeau'),
  },
};

export default seoConfig;