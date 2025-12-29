import React from 'react';
import styled from '@emotion/styled';
import { Upload, Settings, Download } from 'lucide-react';

const Section = styled.section`
  padding: 100px 48px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(236, 72, 153, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 44px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const StepCard = styled.div`
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.2);

  svg {
    width: 36px;
    height: 36px;
    color: white;
  }
`;

const StepTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`;

const StepDescription = styled.p`
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
`;

const Connector = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(236, 72, 153, 0.2) 0%,
    rgba(249, 115, 22, 0.2) 100%
  );
  transform: translateX(-50%);
  z-index: -1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const steps = [
  {
    icon: Upload,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    title: 'Upload Your Images',
    description:
      'Drag and drop your images or click to browse. We support all major formats and batch uploads.',
  },
  {
    icon: Settings,
    gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    title: 'Choose Settings',
    description:
      'Select your desired format, quality, and compression level. Or use our smart defaults.',
  },
  {
    icon: Download,
    gradient: 'linear-gradient(135deg, #eab308 0%, #84cc16 100%)',
    title: 'Download & Done',
    description:
      'Get your optimized images instantly. Download individually or as a zip file.',
  },
];

const HowItWorks = () => {
  return (
    <Section>
      <Container>
        <Header>
          <Badge>How It Works</Badge>
          <Title>Three simple steps</Title>
          <Subtitle>
            Optimize your images in seconds with our streamlined workflow. No
            technical knowledge required.
          </Subtitle>
        </Header>

        <Steps>
          {steps.map((step, index) => (
            <StepCard key={index}>
              {index < steps.length - 1 && <Connector />}
              <StepNumber gradient={step.gradient}>
                <step.icon />
              </StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </Steps>
      </Container>
    </Section>
  );
};

export default HowItWorks;
