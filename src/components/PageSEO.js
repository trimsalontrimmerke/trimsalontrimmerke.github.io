// src/components/PageSEO.js
import React from 'react';
import SEO from '../SEO';
import seoConfig from '../config/seo.config';

const PageSEO = ({ page }) => {
  const config = seoConfig[page];
  if (!config) {
    console.warn(`No SEO config found for page: ${page}`);
    return null;
  }
  return <SEO {...config} />;
};

export default PageSEO;