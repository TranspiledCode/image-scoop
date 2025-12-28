// src/components/WizardContainer.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  scroll-behavior: smooth;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ParallaxBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
`;

const ParallaxLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${({ gradient }) => gradient};
  opacity: ${({ opacity }) => opacity};
  will-change: transform;
`;

const Step = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StepIndicator = styled.div`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;

  @media (max-width: 768px) {
    right: 1rem;
    gap: 0.5rem;
  }
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.gray};
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    transform: scale(1.3);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

const WizardContainer = ({ children, currentStep, onStepChange }) => {
  const containerRef = useRef(null);
  const parallaxLayersRef = useRef([]);
  const rafRef = useRef(null);

  // Smooth scroll to step when currentStep changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targetScroll = (currentStep - 1) * window.innerHeight;
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  }, [currentStep]);

  // Handle parallax effect with requestAnimationFrame
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateParallax = () => {
      const scrollY = container.scrollTop;

      parallaxLayersRef.current.forEach((layer, index) => {
        if (layer) {
          const speed = (index + 1) * 0.15;
          layer.style.transform = `translateY(${scrollY * speed}px)`;
        }
      });
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const scrollToStep = (step) => {
    if (step >= 1 && step <= 4) {
      onStepChange(step);
    }
  };

  // Parallax background gradients
  const parallaxLayers = [
    {
      gradient:
        'radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)',
      opacity: 0.6,
    },
    {
      gradient:
        'radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%)',
      opacity: 0.5,
    },
    {
      gradient:
        'radial-gradient(circle at 40% 80%, rgba(255, 195, 113, 0.08) 0%, transparent 50%)',
      opacity: 0.4,
    },
  ];

  return (
    <>
      <ParallaxBackground>
        {parallaxLayers.map((layer, index) => (
          <ParallaxLayer
            key={index}
            ref={(el) => (parallaxLayersRef.current[index] = el)}
            gradient={layer.gradient}
            opacity={layer.opacity}
          />
        ))}
      </ParallaxBackground>

      <Container ref={containerRef}>
        {React.Children.map(children, (child, index) => (
          <Step key={index}>{child}</Step>
        ))}
      </Container>

      <StepIndicator>
        {[1, 2, 3, 4].map((step) => (
          <Dot
            key={step}
            active={currentStep === step}
            onClick={() => scrollToStep(step)}
            disabled={step === 3} // Can't manually navigate to processing
            aria-label={`Go to step ${step}`}
          />
        ))}
      </StepIndicator>
    </>
  );
};

WizardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepChange: PropTypes.func.isRequired,
};

export default WizardContainer;
