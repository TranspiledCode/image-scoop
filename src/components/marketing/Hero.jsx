import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Zap, FileText, ImageIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    min-height: 100vh;
    padding: 80px 20px 40px;
  }

  @media (max-width: 480px) {
    min-height: 100vh;
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
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 80px;
  position: relative;
  z-index: 10;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 1024px) {
    max-width: 800px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const HeroText = styled.div`
  text-align: center;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: clamp(20px, 3vw, 32px);
  letter-spacing: -1px;
  text-align: center;

  span {
    background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #a3e635 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 1024px) {
    font-size: clamp(36px, 5vw, 56px);
    line-height: 1.15;
  }

  @media (max-width: 768px) {
    font-size: clamp(32px, 7vw, 44px);
    line-height: 1.2;
    margin-bottom: clamp(16px, 3vw, 24px);
  }

  @media (max-width: 480px) {
    font-size: clamp(28px, 8vw, 36px);
    line-height: 1.1;
    margin-bottom: 32px;
  }
`;

const HeroDescription = styled.p`
  font-size: clamp(18px, 2vw, 22px);
  color: #9ca3af;
  max-width: 700px;
  margin: 0 auto clamp(32px, 4vw, 48px);
  line-height: 1.6;
  text-wrap: balance;
  text-align: center;

  @media (max-width: 1024px) {
    max-width: 650px;
    font-size: clamp(17px, 2.2vw, 20px);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: clamp(16px, 3.5vw, 18px);
    line-height: 1.5;
    margin-bottom: clamp(24px, 3vw, 32px);
  }

  @media (max-width: 480px) {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 40px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: clamp(12px, 2vw, 20px);
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    gap: clamp(10px, 1.5vw, 16px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    max-width: 100%;
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
  gap: clamp(20px, 3vw, 40px);
  margin-top: clamp(24px, 4vw, 40px);
  justify-content: center;

  @media (max-width: 1024px) {
    gap: clamp(16px, 2.5vw, 32px);
    margin-top: clamp(20px, 3vw, 32px);
  }

  @media (max-width: 768px) {
    gap: clamp(12px, 2vw, 20px);
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    gap: 24px;
    margin-top: 40px;
    flex-direction: column;
    align-items: center;
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
  const { currentUser } = useAuth();

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
            Optimize images <span>in&nbsp;seconds</span>
          </HeroTitle>
          <HeroDescription>
            Compress, convert, and perfect your images with smart optimization.
            No quality loss, just smaller files that load faster. Try it free
            with no signup required.
          </HeroDescription>

          <CTAButtons>
            <CTAButton to={currentUser ? '/process' : '/process?mode=demo'}>
              <Sparkles />
              {currentUser ? 'Process Images' : 'Start Optimizing Free'}
            </CTAButton>
            <CTAButtonSecondary onClick={scrollToPricing}>
              View Pricing
            </CTAButtonSecondary>
          </CTAButtons>

          <HeroFeatures>
            <HeroFeature>
              <Zap />
              <span>Lightning fast processing</span>
            </HeroFeature>
            <HeroFeature>
              <ImageIcon />
              <span>Multiple formats & sizes</span>
            </HeroFeature>
            <HeroFeature>
              <FileText />
              <span>Batch processing</span>
            </HeroFeature>
          </HeroFeatures>
        </HeroText>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
