import React from 'react';
import styled from '@emotion/styled';
import { Zap, Shield, Globe, Code, Layers, TrendingDown } from 'lucide-react';

const Section = styled.section`
  padding: 100px 48px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
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
  color: #f9a8d4;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 44px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #9ca3af;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(236, 72, 153, 0.3);
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: ${({ gradient }) => gradient};

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  font-size: 15px;
  color: #9ca3af;
  line-height: 1.6;
`;

const features = [
  {
    icon: Zap,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    title: 'Lightning Fast Processing',
    description:
      'Optimize images instantly with our advanced compression engine. Process single images or entire batches with ease.',
  },
  {
    icon: TrendingDown,
    gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    title: 'Smart Compression',
    description:
      'Reduce file sizes by up to 70% while preserving visual quality. Intelligent algorithms maintain image clarity.',
  },
  {
    icon: Layers,
    gradient: 'linear-gradient(135deg, #eab308 0%, #84cc16 100%)',
    title: 'Scalable Processing',
    description:
      'Built for scale with powerful batch processing capabilities. Optimize multiple images at once with our robust architecture.',
  },
  {
    icon: Globe,
    gradient: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
    title: 'Modern Format Support',
    description:
      'Support for next-gen image formats optimized for web performance. Convert between WebP, AVIF, JPEG, and PNG formats.',
  },
  {
    icon: Shield,
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    title: 'Privacy First',
    description:
      'Your images are processed securely and immediately deleted after optimization. We never store or share your data without explicit consent.',
  },
  {
    icon: Code,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    title: 'Developer Tools',
    description:
      'Comprehensive API integration coming soon. Build image optimization directly into your applications and workflows.',
  },
];

const Features = () => {
  return (
    <Section id="features">
      <Container>
        <Header>
          <Badge>
            <Zap size={16} />
            Features
          </Badge>
          <Title>Advanced image optimization platform</Title>
          <Subtitle>
            Powerful compression technology designed for modern web
            applications. Fast, secure, and built to scale with your needs.
          </Subtitle>
        </Header>

        <Grid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <IconWrapper gradient={feature.gradient}>
                <feature.icon />
              </IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Features;
