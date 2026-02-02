import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
  title = 'Image Scoop - Fast Image Processing & Format Conversion',
  description = 'Process and convert images instantly with Image Scoop. Support for WebP, JPEG, PNG, AVIF formats with multiple size variants. Fast, secure, and easy to use.',
  canonical = 'https://imagescoop.com',
  ogImage = 'https://imagescoop.com/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  structuredData = null,
}) => {
  const siteUrl = 'https://imagescoop.com';
  const fullCanonical = canonical.startsWith('http')
    ? canonical
    : `${siteUrl}${canonical}`;

  // Default structured data for Organization
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Image Scoop',
    description:
      'Fast, secure image processing and format conversion tool supporting WebP, JPEG, PNG, and AVIF formats.',
    url: siteUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Image Scoop',
      url: siteUrl,
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Image Scoop" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@imagescoop" />
      <meta name="twitter:creator" content="@imagescoop" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(defaultStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  twitterCard: PropTypes.string,
  noindex: PropTypes.bool,
  structuredData: PropTypes.object,
};

export default SEO;
