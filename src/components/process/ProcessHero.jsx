// src/components/process/ProcessHero.jsx
import React from 'react';
import styled from '@emotion/styled';
import processTheme from '../../style/processTheme';

const HeroSection = styled.section`
  position: relative;
  padding: clamp(100px, 12vw, 120px) clamp(24px, 5vw, 48px)
    clamp(40px, 6vw, 60px);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${processTheme.breakpoints.tablet}) {
    padding: clamp(80px, 10vw, 100px) clamp(20px, 4vw, 40px)
      clamp(30px, 5vw, 50px);
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 80px 20px 30px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: clamp(32px, 5vw, 44px);
  font-weight: 800;
  color: ${processTheme.textPrimary};
  line-height: 1.2;
  margin-bottom: clamp(12px, 2vw, 16px);
  letter-spacing: -1px;

  span {
    background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #a3e635 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: clamp(28px, 6vw, 32px);
  }
`;

const HeroDescription = styled.p`
  font-size: clamp(14px, 2vw, 16px);
  color: ${processTheme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 14px;
  }
`;

const ProcessHero = () => {
  return (
    <HeroSection>
      <HeroContent>
        <HeroTitle>
          Process Your <span>Images</span>
        </HeroTitle>
        <HeroDescription>
          Upload, optimize, and download your images in seconds. Fast, secure,
          and privacy-focused.
        </HeroDescription>
      </HeroContent>
    </HeroSection>
  );
};

export default ProcessHero;
