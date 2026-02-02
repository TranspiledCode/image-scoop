import React, { lazy, Suspense } from 'react';
import styled from '@emotion/styled';
import SEO from '../components/SEO';
import Hero from '../components/marketing/Hero';

// Lazy load all below-the-fold sections for better initial performance
const Features = lazy(() => import('../components/marketing/Features'));
const HowItWorks = lazy(() => import('../components/marketing/HowItWorks'));
const WhatYouGet = lazy(() => import('../components/marketing/WhatYouGet'));
const Pricing = lazy(() => import('../components/marketing/Pricing'));
const Stats = lazy(() => import('../components/marketing/StatsSection'));
const FAQ = lazy(() => import('../components/marketing/FAQ'));
const CTA = lazy(() => import('../components/marketing/CTA'));
const Footer = lazy(() => import('../components/marketing/Footer'));

const MarketingPage = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

// Minimal loading placeholder for below-the-fold content
const SectionLoader = () => (
  <div
    style={{
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
    }}
  >
    Loading...
  </div>
);

const Marketing = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://imagescoop.com/#webapp',
        name: 'Image Scoop',
        description:
          'Fast, secure image processing and format conversion tool. Convert images to WebP, JPEG, PNG, and AVIF formats with multiple size variants in seconds.',
        url: 'https://imagescoop.com',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        featureList: [
          'WebP, JPEG, PNG, AVIF format conversion',
          'Multiple size variants (thumbnail to XXL)',
          'Batch processing',
          'Secure cloud processing',
          'Instant download',
        ],
        screenshot: 'https://imagescoop.com/og-image.png',
      },
      {
        '@type': 'Organization',
        '@id': 'https://imagescoop.com/#organization',
        name: 'Image Scoop',
        url: 'https://imagescoop.com',
        logo: 'https://imagescoop.com/logo.png',
        sameAs: ['https://twitter.com/imagescoop'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://imagescoop.com/#website',
        url: 'https://imagescoop.com',
        name: 'Image Scoop',
        description: 'Fast image processing and format conversion',
        publisher: {
          '@id': 'https://imagescoop.com/#organization',
        },
      },
    ],
  };

  return (
    <MarketingPage>
      <SEO
        title="Image Scoop - Fast Image Processing & Format Conversion"
        description="Process and convert images instantly with Image Scoop. Support for WebP, JPEG, PNG, AVIF formats with multiple size variants. Fast, secure, and easy to use. Try it free!"
        canonical="https://imagescoop.com"
        structuredData={structuredData}
      />
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WhatYouGet />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CTA />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </MarketingPage>
  );
};

export default Marketing;
