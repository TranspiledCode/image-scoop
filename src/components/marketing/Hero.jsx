import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Zap, FileText } from 'lucide-react';
import { useDemoMode } from '../../hooks/useDemoMode';
import InteractiveDemo from './InteractiveDemo';

const HeroSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  position: relative;
  overflow: hidden;
  padding: clamp(80px, 12vw, 100px) clamp(24px, 5vw, 48px)
    clamp(60px, 10vw, 80px);
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    min-height: auto;
    padding: 60px 20px 40px;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(40px, 8vw, 80px);
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: clamp(32px, 6vw, 48px);
  }
`;

const HeroText = styled.div`
  text-align: left;
`;

const HeroTitle = styled.h1`
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: clamp(16px, 3vw, 24px);
  letter-spacing: -1px;

  span {
    background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #a3e635 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 480px) {
    font-size: clamp(28px, 8vw, 36px);
  }
`;

const HeroDescription = styled.p`
  font-size: clamp(16px, 2vw, 18px);
  color: #9ca3af;
  max-width: 500px;
  margin: 0 0 clamp(32px, 4vw, 40px) 0;
  line-height: 1.7;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: clamp(12px, 2vw, 16px);
  margin-bottom: clamp(32px, 5vw, 48px);

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  text-decoration: none;
  padding: clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px);
  border-radius: 14px;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);
  transition: all 0.2s;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const CTAButtonSecondary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: transparent;
  color: white;
  border: 2px solid #374151;
  padding: clamp(10px, 2vw, 14px) clamp(22px, 4vw, 30px);
  border-radius: 14px;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;

  &:hover {
    border-color: #4b5563;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const HeroFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 32px);
  margin-top: clamp(32px, 5vw, 48px);

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const HeroFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 20px;
    height: 20px;
    color: #10b981;
    flex-shrink: 0;
  }

  span {
    font-size: clamp(13px, 1.5vw, 14px);
    color: #d1d5db;
  }
`;

const Hero = () => {
  const isDemoMode = useDemoMode();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <HeroSection id="hero">
      <BackgroundPattern />

      <HeroContent>
        <HeroText>
          <HeroTitle>
            Optimize <span>in&nbsp;seconds</span>
          </HeroTitle>
          <HeroDescription>
            Compress, convert, and perfect your images with smart optimization.
            No quality loss, just smaller files that load faster.
          </HeroDescription>

          <CTAButtons>
            {isDemoMode ? (
              <CTAButton as="button" onClick={scrollToHowItWorks}>
                How It Works
              </CTAButton>
            ) : (
              <CTAButton to="/process">Try it Free</CTAButton>
            )}
            {!isDemoMode && (
              <CTAButtonSecondary onClick={scrollToPricing}>
                View Pricing
              </CTAButtonSecondary>
            )}
          </CTAButtons>

          <HeroFeatures>
            <HeroFeature>
              <Zap />
              <span>Lightning fast</span>
            </HeroFeature>
            <HeroFeature>
              <FileText />
              <span>No sign-up required</span>
            </HeroFeature>
          </HeroFeatures>
        </HeroText>

        <InteractiveDemo />
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
