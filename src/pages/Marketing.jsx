import React from 'react';
import styled from '@emotion/styled';
import Hero from '../components/marketing/Hero';
import Features from '../components/marketing/Features';
import HowItWorks from '../components/marketing/HowItWorks';
import WhatYouGet from '../components/marketing/WhatYouGet';
// import Comparison from '../components/marketing/Comparison';
// import ApiSection from '../components/marketing/ApiSection';
import Pricing from '../components/marketing/Pricing';
import Stats from '../components/marketing/StatsSection';
import FAQ from '../components/marketing/FAQ';
import CTA from '../components/marketing/CTA';
import Footer from '../components/marketing/Footer';

const MarketingPage = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const Marketing = () => {
  return (
    <MarketingPage>
      <Hero />
      <Features />
      <HowItWorks />
      <WhatYouGet />
      {/* <Comparison /> */}
      <Pricing />
      {/* <ApiSection /> */}
      <Stats />
      <FAQ />
      <CTA />
      <Footer />
    </MarketingPage>
  );
};

export default Marketing;
