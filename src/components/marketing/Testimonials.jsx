import React from 'react';
import styled from '@emotion/styled';
import { TrendingUp, Users, Zap, Globe } from 'lucide-react';
import useStats from '../../hooks/useStats';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(236, 72, 153, 0.3);
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.2);

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const StatValue = styled.div`
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #f9a8d4 0%, #fdba74 50%, #bef264 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 15px;
  color: #9ca3af;
  font-weight: 500;
`;

const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M+`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K+`;
  }
  return num.toString();
};

const formatBytes = (bytes) => {
  if (bytes >= 1000000000000) {
    return `${(bytes / 1000000000000).toFixed(1)}TB`;
  }
  if (bytes >= 1000000000) {
    return `${(bytes / 1000000000).toFixed(0)}GB`;
  }
  if (bytes >= 1000000) {
    return `${(bytes / 1000000).toFixed(0)}MB`;
  }
  return `${(bytes / 1000).toFixed(0)}KB`;
};

const Stats = () => {
  const { totalUsers, totalConversions, totalStorageSaved, uptime, loading } =
    useStats();

  const stats = [
    {
      icon: Users,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
      value: loading ? '...' : formatNumber(totalUsers),
      label: 'Users',
    },
    {
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
      value: loading ? '...' : formatNumber(totalConversions),
      label: 'Images Processed',
    },
    {
      icon: Zap,
      gradient: 'linear-gradient(135deg, #eab308 0%, #84cc16 100%)',
      value: loading ? '...' : formatBytes(totalStorageSaved),
      label: 'Bytes Saved',
    },
    {
      icon: Globe,
      gradient: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
      value: `${uptime}%`,
      label: 'System Reliability',
    },
  ];

  return (
    <Section>
      <Container>
        <Header>
          <Badge>
            <TrendingUp size={16} />
            Stats
          </Badge>
          <Title>Trusted by thousands worldwide</Title>
          <Subtitle>
            Join the growing community of creators and developers optimizing
            millions of images every month.
          </Subtitle>
        </Header>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <IconWrapper gradient={stat.gradient}>
                <stat.icon />
              </IconWrapper>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Container>
    </Section>
  );
};

export default Stats;
