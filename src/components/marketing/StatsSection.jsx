import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { TrendingUp, Users, Zap, Globe } from 'lucide-react';
import useStats from '../../hooks/useStats';
import StatCard from './StatCard';
import StatsHeader from './StatsHeader';
import theme from '../../style/theme';

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
  color: ${theme.colors.white};
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${theme.colors.gray};
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

const ErrorFallback = () => (
  <Container>
    <Header>
      <Badge>
        <TrendingUp size={16} />
        Stats
      </Badge>
      <Title>Trusted by users worldwide</Title>
      <Subtitle>
        Join the growing community of creators and developers optimizing
        millions of images every month.
      </Subtitle>
    </Header>
    <StatsGrid>
      <StatCard
        icon={Users}
        gradient="linear-gradient(135deg, #ec4899 0%, #f97316 100%)"
        value="Loading..."
        label="Users"
      />
      <StatCard
        icon={TrendingUp}
        gradient="linear-gradient(135deg, #f97316 0%, #eab308 100%)"
        value="Loading..."
        label="Images Processed"
      />
      <StatCard
        icon={Zap}
        gradient="linear-gradient(135deg, #eab308 0%, #84cc16 100%)"
        value="Loading..."
        label="Bytes Saved"
      />
      <StatCard
        icon={Globe}
        gradient="linear-gradient(135deg, #84cc16 0%, #10b981 100%)"
        value="99.9%"
        label="System Reliability"
      />
    </StatsGrid>
  </Container>
);

const Stats = () => {
  const {
    totalUsers,
    totalConversions,
    totalStorageSaved,
    uptime,
    loading,
    error,
  } = useStats();

  const stats = useMemo(
    () => [
      {
        icon: Users,
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
        value: loading || error ? '...' : formatNumber(totalUsers),
        label: 'Users',
      },
      {
        icon: TrendingUp,
        gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
        value: loading || error ? '...' : formatNumber(totalConversions),
        label: 'Images Processed',
      },
      {
        icon: Zap,
        gradient: 'linear-gradient(135deg, #eab308 0%, #84cc16 100%)',
        value: loading || error ? '...' : formatBytes(totalStorageSaved),
        label: 'Bytes Saved',
      },
      {
        icon: Globe,
        gradient: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
        value: `${uptime}%`,
        label: 'System Reliability',
      },
    ],
    [totalUsers, totalConversions, totalStorageSaved, uptime, loading, error],
  );

  if (error) {
    return <ErrorFallback />;
  }

  return (
    <Section>
      <Container>
        <StatsHeader totalUsers={totalUsers} loading={loading} />
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              gradient={stat.gradient}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </StatsGrid>
      </Container>
    </Section>
  );
};

export default Stats;
