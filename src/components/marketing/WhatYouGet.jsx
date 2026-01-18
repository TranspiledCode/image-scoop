import React from 'react';
import styled from '@emotion/styled';
import {
  Package,
  Smartphone,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import FileTreePreview from './FileTreePreview';
import FormatComparisonTable from './FormatComparisonTable';

const Section = styled.section`
  padding: 100px 48px;
  background: white;

  @media (max-width: 768px) {
    padding: 60px 24px;
  }
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

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  margin-bottom: 64px;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const ContentBlock = styled.div``;

const SectionTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
`;

const SectionDescription = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 32px;
`;

const SizesList = styled.div`
  display: grid;
  gap: 16px;
`;

const SizeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const SizeIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const SizeInfo = styled.div`
  flex: 1;
`;

const SizeName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const SizeDetails = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 64px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  text-align: center;
`;

const StatIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;

  svg {
    width: 24px;
    height: 24px;
    color: #10b981;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const BenefitText = styled.div`
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
`;

const sizes = [
  { name: 'XL', width: '1920px', device: 'Desktop & large screens' },
  { name: 'LG', width: '1280px', device: 'Laptop & medium screens' },
  { name: 'MD', width: '768px', device: 'Tablet & small laptops' },
  { name: 'SM', width: '480px', device: 'Mobile devices' },
];

const stats = [
  {
    icon: Package,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    value: '~65%',
    label: 'Average file size reduction',
  },
  {
    icon: Zap,
    gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    value: '3x',
    label: 'Faster page load times',
  },
  {
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #eab308 0%, #84cc16 100%)',
    value: '100%',
    label: 'Better Core Web Vitals',
  },
];

const benefits = [
  'Responsive sizes for all devices',
  'Optimized for web performance',
  'Organized folder structure',
  'Ready to use with <picture> tag',
  'Faster page loads & better UX',
  'Improved SEO rankings',
];

const WhatYouGet = () => {
  return (
    <Section id="what-you-get">
      <Container>
        <Header>
          <Badge>What You Get</Badge>
          <Title>Everything you need for responsive images</Title>
          <Subtitle>
            Download a complete set of optimized images, perfectly sized for
            every device and ready to deploy.
          </Subtitle>
        </Header>

        <ContentGrid>
          <ContentBlock>
            <SectionTitle>Perfect for Every Device</SectionTitle>
            <SectionDescription>
              Each image is automatically resized to four responsive
              breakpoints, ensuring optimal quality and performance across all
              screen sizes.
            </SectionDescription>
            <SizesList>
              {sizes.map((size, index) => (
                <SizeItem key={index}>
                  <SizeIcon>
                    <Smartphone />
                  </SizeIcon>
                  <SizeInfo>
                    <SizeName>
                      {size.name} - {size.width}
                    </SizeName>
                    <SizeDetails>{size.device}</SizeDetails>
                  </SizeInfo>
                </SizeItem>
              ))}
            </SizesList>
          </ContentBlock>

          <ContentBlock>
            <SectionTitle>Organized File Structure</SectionTitle>
            <SectionDescription>
              Your images are delivered in a clean, organized folder structure
              with descriptive filenames for easy integration.
            </SectionDescription>
            <FileTreePreview />
          </ContentBlock>
        </ContentGrid>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon gradient={stat.gradient}>
                <stat.icon />
              </StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <div>
          <SectionTitle style={{ textAlign: 'center', marginBottom: '16px' }}>
            Choose Your Format
          </SectionTitle>
          <SectionDescription
            style={{
              textAlign: 'center',
              maxWidth: '700px',
              margin: '0 auto 32px',
            }}
          >
            Select the best image format for your needs. Each format offers
            different benefits for compression, quality, and browser support.
          </SectionDescription>
          <FormatComparisonTable />
        </div>

        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitItem key={index}>
              <CheckCircle2 />
              <BenefitText>{benefit}</BenefitText>
            </BenefitItem>
          ))}
        </BenefitsGrid>
      </Container>
    </Section>
  );
};

export default WhatYouGet;
