import React from 'react';
import styled from '@emotion/styled';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import { useUserUsage } from '../../hooks/useUserUsage';
import { useUserSubscription } from '../../hooks/useUserSubscription';
import { useNavigate } from 'react-router-dom';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: #f9fafb;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  padding: 20px;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ background }) => background};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 24px;
  color: #1f2937;
  font-weight: 800;

  span {
    font-size: 14px;
    color: #6b7280;
    font-weight: 600;
  }
`;

const ProgressSection = styled.div`
  margin-top: 16px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
`;

const ProgressText = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const ProgressPercentage = styled.span`
  color: #1f2937;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #f3f4f6;
  border-radius: 100px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: ${({ percentage }) =>
    percentage >= 90
      ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
      : percentage >= 70
        ? 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)'
        : 'linear-gradient(90deg, #ec4899 0%, #f97316 50%, #a3e635 100%)'};
  border-radius: 100px;
  position: relative;
  transition: width 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const UnlimitedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  margin-top: 8px;
`;

const UpgradePrompt = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #f59e0b;
    flex-shrink: 0;
  }
`;

const UpgradeText = styled.div`
  flex: 1;
  font-size: 14px;
  color: #78350f;
  line-height: 1.5;

  strong {
    font-weight: 700;
  }
`;

const UpgradeButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }
`;

const UsageSection = () => {
  const {
    usage,
    loading,
    planLimits,
    dailyUsagePercentage,
    monthlyUsagePercentage,
    imagesProcessedToday,
    totalImagesProcessed,
  } = useUserUsage();
  const { subscription } = useUserSubscription();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading usage data...</div>;
  }

  const isFreePlan = subscription?.planId === 'free';
  const showUpgradePrompt = dailyUsagePercentage >= 70 && isFreePlan;

  return (
    <Section>
      <Card>
        <CardTitle>Usage Statistics</CardTitle>

        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon background="rgba(236, 72, 153, 0.1)" color="#ec4899">
                <BarChart3 />
              </StatIcon>
              <StatContent>
                <StatLabel>Today</StatLabel>
                <StatValue>
                  {imagesProcessedToday}
                  {planLimits.dailyLimit && (
                    <span> / {planLimits.dailyLimit}</span>
                  )}
                </StatValue>
              </StatContent>
            </StatHeader>

            {planLimits.unlimited ? (
              <UnlimitedBadge>
                <Zap size={12} />
                Unlimited
              </UnlimitedBadge>
            ) : planLimits.dailyLimit ? (
              <ProgressSection>
                <ProgressLabel>
                  <ProgressText>Daily Limit</ProgressText>
                  <ProgressPercentage>
                    {dailyUsagePercentage.toFixed(0)}%
                  </ProgressPercentage>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill percentage={dailyUsagePercentage} />
                </ProgressBar>
              </ProgressSection>
            ) : null}
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon background="rgba(59, 130, 246, 0.1)" color="#3b82f6">
                <TrendingUp />
              </StatIcon>
              <StatContent>
                <StatLabel>This Period</StatLabel>
                <StatValue>
                  {totalImagesProcessed}
                  {planLimits.monthlyLimit && (
                    <span> / {planLimits.monthlyLimit}</span>
                  )}
                </StatValue>
              </StatContent>
            </StatHeader>

            {planLimits.unlimited ? (
              <UnlimitedBadge>
                <Zap size={12} />
                Unlimited
              </UnlimitedBadge>
            ) : planLimits.monthlyLimit ? (
              <ProgressSection>
                <ProgressLabel>
                  <ProgressText>Monthly Limit</ProgressText>
                  <ProgressPercentage>
                    {monthlyUsagePercentage.toFixed(0)}%
                  </ProgressPercentage>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill percentage={monthlyUsagePercentage} />
                </ProgressBar>
              </ProgressSection>
            ) : null}
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon background="rgba(16, 185, 129, 0.1)" color="#10b981">
                <Calendar />
              </StatIcon>
              <StatContent>
                <StatLabel>Period Starts</StatLabel>
                <StatValue style={{ fontSize: '16px' }}>
                  {new Date(
                    usage?.currentPeriodStart || Date.now(),
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </StatValue>
              </StatContent>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        {showUpgradePrompt && (
          <UpgradePrompt>
            <Zap size={20} />
            <UpgradeText>
              <strong>
                You&apos;re using {dailyUsagePercentage.toFixed(0)}% of your
                daily limit!
              </strong>{' '}
              Upgrade to Plus or Pro for higher limits.
            </UpgradeText>
            <UpgradeButton onClick={() => navigate('/plan-selection')}>
              Upgrade
            </UpgradeButton>
          </UpgradePrompt>
        )}
      </Card>
    </Section>
  );
};

export default UsageSection;
