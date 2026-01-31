import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Zap, FileText } from 'lucide-react';

const InteractiveDemo = lazy(() => import('./InteractiveDemo'));

// Loading component for demo
const DemoLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px dashed rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      color: '#9ca3af',
      fontSize: '16px',
    }}
  >
    Loading demo...
  </div>
);

const HeroSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  position: relative;
  overflow: hidden;
  padding: clamp(120px, 14vw, 140px) clamp(24px, 5vw, 48px)
    clamp(60px, 10vw, 80px);
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    min-height: 90vh;
    padding: clamp(100px, 10vw, 120px) clamp(20px, 4vw, 40px)
      clamp(40px, 6vw, 60px);
  }

  @media (max-width: 768px) {
    min-height: auto;
    padding: 80px 20px 40px;
  }

  @media (max-width: 480px) {
    padding: 70px 16px 30px;
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
  padding-bottom: 80px;
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
    max-width: 900px;
  }

  @media (max-width: 768px) {
    gap: clamp(24px, 5vw, 36px);
    max-width: 100%;
    overflow: hidden;
  }

  @media (max-width: 480px) {
    gap: 20px;
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

  @media (max-width: 1024px) {
    font-size: clamp(32px, 4.5vw, 48px);
    line-height: 1.2;
  }

  @media (max-width: 768px) {
    font-size: clamp(28px, 6vw, 36px);
    line-height: 1.1;
    margin-bottom: clamp(12px, 2.5vw, 20px);
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: clamp(24px, 7vw, 32px);
    line-height: 1;
    margin-bottom: 16px;
    text-align: center;
  }
`;

const HeroDescription = styled.p`
  font-size: clamp(16px, 2vw, 18px);
  color: #9ca3af;
  max-width: 500px;
  margin: 0 0 clamp(32px, 4vw, 40px) 0;
  line-height: 1.7;
  text-wrap: balance;

  @media (max-width: 1024px) {
    max-width: 600px;
    font-size: clamp(15px, 2.2vw, 17px);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: clamp(14px, 3.5vw, 16px);
    line-height: 1.6;
    margin-bottom: clamp(16px, 3vw, 20px);
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
    text-align: center;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: clamp(12px, 2vw, 16px);

  @media (max-width: 1024px) {
    gap: clamp(10px, 1.5vw, 14px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 12px;

    /* Hide "How it works" button on mobile */
    .how-it-works-btn {
      display: none;
    }
  }

  @media (max-width: 480px) {
    gap: 10px;

    /* Hide "How it works" button on mobile */
    .how-it-works-btn {
      display: none;
    }
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
  padding: clamp(14px, 2vw, 18px) clamp(24px, 4vw, 32px);
  border-radius: 14px;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);
  transition: all 0.2s;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  font-family: inherit;
  min-height: 44px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }

  @media (max-width: 1024px) {
    padding: clamp(12px, 2.5vw, 16px) clamp(20px, 3.5vw, 28px);
    font-size: clamp(13px, 1.8vw, 15px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 24px;
    font-size: 15px;
    min-height: 48px;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 14px;
    min-height: 44px;
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
  padding: clamp(12px, 2vw, 16px) clamp(22px, 4vw, 30px);
  border-radius: 14px;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;
  min-height: 44px;

  &:hover {
    border-color: #4b5563;
  }

  @media (max-width: 1024px) {
    padding: clamp(10px, 2.5vw, 14px) clamp(18px, 3.5vw, 26px);
    font-size: clamp(13px, 1.8vw, 15px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 22px;
    font-size: 15px;
    min-height: 48px;
  }

  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 14px;
    min-height: 44px;
  }
`;

const HeroFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 32px);
  margin-top: clamp(20px, 4vw, 32px);

  @media (max-width: 1024px) {
    gap: clamp(12px, 2.5vw, 24px);
    margin-top: clamp(16px, 3vw, 28px);
  }

  @media (max-width: 768px) {
    gap: clamp(8px, 2vw, 16px);
    margin-top: 12px;
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 8px;
    flex-direction: row;
    justify-content: space-between;
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

  @media (max-width: 1024px) {
    gap: 8px;

    svg {
      width: 18px;
      height: 18px;
    }

    span {
      font-size: clamp(12px, 1.8vw, 13px);
    }
  }

  @media (max-width: 768px) {
    gap: 8px;

    svg {
      width: 18px;
      height: 18px;
    }

    span {
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    gap: 6px;
    flex: 1;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
    }

    span {
      font-size: 12px;
    }
  }
`;

const Hero = () => {
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
            <CTAButton to="/process">Try it Free</CTAButton>
            <CTAButtonSecondary onClick={scrollToPricing}>
              View Pricing
            </CTAButtonSecondary>
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

        <Suspense fallback={<DemoLoader />}>
          <InteractiveDemo />
        </Suspense>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
