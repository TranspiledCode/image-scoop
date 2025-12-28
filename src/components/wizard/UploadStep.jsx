// src/components/wizard/UploadStep.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Upload, Sparkles, Zap, Image as ImageIcon } from 'lucide-react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transition: opacity 2s ease-in-out;
`;

const StepContainer = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0 2rem 2rem;
  margin-top: -8rem;
  position: relative;
  z-index: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0 1rem 1rem;
    margin-top: -5rem;
  }
`;

const DropZoneContainer = styled.div`
  width: 100%;
  max-width: 750px;
  min-height: 450px;
  position: relative;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 3rem;
  margin-bottom: 2.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${fadeIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  overflow: hidden;

  /* Glassmorphism effect */
  background: ${({ theme, isDragActive }) =>
    isDragActive
      ? `linear-gradient(135deg, 
          ${theme.colors.primaryLight}25 0%, 
          ${theme.colors.secondaryLight}20 50%,
          ${theme.colors.tertiaryLight}15 100%)`
      : `rgba(255, 255, 255, 0.7)`};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  /* Subtle border with gradient */
  border: 2px solid
    ${({ theme, isDragActive }) =>
      isDragActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.3)'};

  /* Layered shadows for depth */
  box-shadow:
    0 8px 32px rgba(31, 38, 135, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5),
    ${({ isDragActive }) =>
      isDragActive
        ? '0 0 60px rgba(255, 92, 141, 0.3)'
        : '0 0 0 rgba(0, 0, 0, 0)'};

  /* Animated gradient overlay on hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary}15 0%,
      ${({ theme }) => theme.colors.secondary}10 50%,
      ${({ theme }) => theme.colors.tertiary}08 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    border-radius: 32px;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow:
      0 20px 60px rgba(255, 92, 141, 0.2),
      0 8px 32px rgba(31, 38, 135, 0.12),
      inset 0 0 0 1px rgba(255, 255, 255, 0.6);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.99);
  }

  @media (max-width: 768px) {
    min-height: 350px;
    padding: 3rem 2rem;
    border-radius: 24px;
  }
`;

const IconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}20 0%,
    ${({ theme }) => theme.colors.secondary}15 100%
  );
  animation: ${float} 4s ease-in-out infinite;

  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(255, 92, 141, 0.2),
    inset 0 0 20px rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    padding: 2px;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.secondary},
      ${({ theme }) => theme.colors.tertiary}
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    animation: ${pulse} 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;

const UploadIcon = styled(Upload)`
  width: 56px;
  height: 56px;
  color: ${({ theme }) => theme.colors.primary};
  filter: drop-shadow(0 4px 16px rgba(255, 92, 141, 0.4));
  z-index: 1;

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
  }
`;

const DropZoneText = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const DropZoneSubtext = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  margin: -1rem 0 0 0;
  text-align: center;
  opacity: 0.7;
  font-weight: 500;

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 750px;
  animation: ${fadeIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 92, 141, 0.1),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow:
      0 16px 48px rgba(255, 92, 141, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 0 0 2px rgba(255, 92, 141, 0.3);
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255, 255, 255, 0.98);

    &::before {
      left: 100%;
    }

    svg {
      transform: scale(1.2) rotate(5deg);
      filter: drop-shadow(0 4px 16px rgba(255, 92, 141, 0.5));
    }
  }

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.colors.primary};
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    filter: drop-shadow(0 4px 12px rgba(255, 92, 141, 0.3));
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
  text-align: center;
  letter-spacing: -0.01em;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.darkGray};
  margin: 0;
  text-align: center;
  line-height: 1.5;
  opacity: 0.9;
`;

const UploadStep = ({ getRootProps, getInputProps, isDragActive }) => {
  const [currentBg, setCurrentBg] = useState(0);

  const CLOUDFLARE_HASH = 'AjKAvtYVvwYZJx-5TwXk4w';

  // Using 'public' variant - Cloudflare automatically optimizes from the XXL source
  const backgrounds = [
    `https://imagedelivery.net/${CLOUDFLARE_HASH}/image-scoop/backgrounds/fall-road/public`,
    `https://imagedelivery.net/${CLOUDFLARE_HASH}/image-scoop/backgrounds/mountains/public`,
    `https://imagedelivery.net/${CLOUDFLARE_HASH}/image-scoop/backgrounds/waterfall/public`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <>
      <BackgroundContainer>
        {backgrounds.map((imageUrl, index) => (
          <BackgroundLayer
            key={index}
            imageUrl={imageUrl}
            isActive={currentBg === index}
          />
        ))}
      </BackgroundContainer>

      <StepContainer>
        <DropZoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <IconContainer>
            <UploadIcon />
          </IconContainer>
          <DropZoneText>
            {isDragActive ? '✨ Drop your images here' : 'Drag & drop images'}
          </DropZoneText>
          <DropZoneSubtext>
            or <span>click to browse</span> your files
          </DropZoneSubtext>
        </DropZoneContainer>

        <FeatureList>
          <FeatureCard>
            <Zap />
            <FeatureTitle>Lightning Fast</FeatureTitle>
            <FeatureDescription>
              Optimize images in seconds with our powerful engine
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <ImageIcon />
            <FeatureTitle>Smart Compression</FeatureTitle>
            <FeatureDescription>
              Reduce file size by up to 70% without quality loss
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <Sparkles />
            <FeatureTitle>Multiple Formats</FeatureTitle>
            <FeatureDescription>
              Convert to WebP, JPEG, or PNG with one click
            </FeatureDescription>
          </FeatureCard>
        </FeatureList>
      </StepContainer>
    </>
  );
};

UploadStep.propTypes = {
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  isDragActive: PropTypes.bool.isRequired,
};

export default UploadStep;
