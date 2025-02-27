// src/components/AboutSection.jsx
import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  IceCream,
  Upload,
  Download,
  ArrowRight,
  Gauge,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import TechnicalDetails from 'components/TechnicalDetails';

const AboutContainer = styled.div`
  max-width: 80rem;
  width: 100%;
  margin: 2rem auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 2.25rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Description = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 1.5rem;
`;

const StepContainer = styled.div`
  margin: 2rem 0;
`;

const Step = styled.div`
  display: flex;
  margin-bottom: 2rem;
  position: relative;
`;

const StepNumber = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1.5rem;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const TipBox = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiaryLight};
  border-left: 4px solid ${({ theme }) => theme.colors.tertiary};
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0.5rem;
`;

const TipTitle = styled.h4`
  color: ${({ theme }) => theme.colors.tertiaryDark};
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipText = styled.p`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 1.5rem;
  line-height: 1.5;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 2rem auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight + '30'};
    transform: translateY(-2px);
  }
`;

const AboutSection = () => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <AboutContainer id="about-section">
      <Title>
        <IceCream size={28} />
        How Pixel Pushup Works
      </Title>

      <Description>
        Pixel Pushup is a simple, fast tool for optimizing your images for the
        web. It helps reduce file sizes while maintaining quality, making your
        websites load faster.
      </Description>

      <StepContainer>
        <Step>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>
              <Upload size={22} />
              Upload Your Images
            </StepTitle>
            <StepDescription>
              Drag and drop your images into the upload area, or click to browse
              your files. Supported formats: JPEG, PNG, WebP (up to 5 images at
              once).
            </StepDescription>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>
              <ArrowRight size={22} />
              Choose Your Output Format
            </StepTitle>
            <StepDescription>
              Select the output format: WebP (best balance of size and quality),
              PNG (for transparency), JPEG (widely compatible), or AVIF
              (next-gen).
            </StepDescription>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>
              <Download size={22} />
              Process and Download
            </StepTitle>
            <StepDescription>
              Click Process Images to start the optimization. Once complete, the
              optimized images will be available for download with smaller file
              sizes.
            </StepDescription>
          </StepContent>
        </Step>
      </StepContainer>

      <TipBox>
        <TipTitle>
          <Gauge size={20} />
          Why This Matters
        </TipTitle>
        <TipText>
          Smaller image files mean faster page loads, better user experience,
          and improved SEO. Modern formats like WebP can reduce file size by up
          to 30% compared to traditional formats!
        </TipText>
      </TipBox>

      <ToggleButton
        onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
        aria-expanded={showTechnicalDetails}
      >
        {showTechnicalDetails ? (
          <>
            Hide Technical Details <ChevronUp size={18} />
          </>
        ) : (
          <>
            View Technical Details <ChevronDown size={18} />
          </>
        )}
      </ToggleButton>

      {showTechnicalDetails && <TechnicalDetails />}
    </AboutContainer>
  );
};

export default AboutSection;
