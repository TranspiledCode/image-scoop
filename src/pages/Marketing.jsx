import React, { lazy, Suspense } from 'react';
import styled from '@emotion/styled';
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
  return (
    <MarketingPage>
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
