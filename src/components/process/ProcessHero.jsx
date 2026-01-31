// src/components/process/ProcessHero.jsx
import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Coins,
  Infinity as InfinityIcon,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import processTheme from '../../style/processTheme';
import { useProcessingLimits } from '../../hooks/useProcessingLimits';

const HeroSection = styled.section`
  position: relative;
  padding: clamp(100px, 12vw, 120px) clamp(24px, 5vw, 48px)
    clamp(40px, 6vw, 60px);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${processTheme.breakpoints.tablet}) {
    padding: clamp(80px, 10vw, 100px) clamp(20px, 4vw, 40px)
      clamp(30px, 5vw, 50px);
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 80px 20px 30px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: clamp(32px, 5vw, 44px);
  font-weight: 800;
  color: ${processTheme.textPrimary};
  line-height: 1.2;
  margin-bottom: clamp(12px, 2vw, 16px);
  letter-spacing: -1px;

  span {
    background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #a3e635 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: clamp(28px, 6vw, 32px);
  }
`;

const HeroDescription = styled.p`
  font-size: clamp(14px, 2vw, 16px);
  color: ${processTheme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 14px;
  }
`;

const LimitContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LimitBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  color: ${processTheme.textPrimary};

  svg {
    width: 18px;
    height: 18px;
    color: #f472b6;
  }
`;

const UnlimitedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.2) 0%,
    rgba(52, 211, 153, 0.2) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
  color: #10b981;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DemoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.25) 0%,
    rgba(147, 51, 234, 0.25) 100%
  );
  backdrop-filter: blur(10px);
  border: 2px solid rgba(59, 130, 246, 0.5);
  border-radius: 100px;
  font-size: 15px;
  font-weight: 700;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

const WarningBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: linear-gradient(
    135deg,
    rgba(251, 146, 60, 0.15) 0%,
    rgba(251, 191, 36, 0.15) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 146, 60, 0.3);
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;

  svg {
    width: 20px;
    height: 20px;
    color: #fb923c;
    flex-shrink: 0;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
`;

const WarningText = styled.div`
  flex: 1;
  font-size: 13px;
  color: ${processTheme.textPrimary};
  line-height: 1.5;
`;

const UpgradeButton = styled.button`
  padding: 6px 16px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }
`;

const ProcessHero = () => {
  const navigate = useNavigate();
  const {
    planLimits,
    dailyRemaining,
    scoopBalance,
    isNearLimit,
    isDemo,
    demoRemaining,
    demoLimit,
  } = useProcessingLimits();

  const showDailyLimit =
    !isDemo && !planLimits.unlimited && planLimits.dailyLimit;
  const showScoopBalance =
    !isDemo &&
    (planLimits.useScoops || (scoopBalance > 0 && !planLimits.unlimited));
  const showUnlimited = !isDemo && planLimits.unlimited;
  const hasBackupScoops = scoopBalance > 0 && !planLimits.useScoops;

  return (
    <HeroSection>
      <HeroContent>
        <HeroTitle>
          Process Your <span>Images</span>
        </HeroTitle>
        <HeroDescription>
          Upload, optimize, and download your images in seconds. Fast, secure,
          and privacy-focused.
        </HeroDescription>

        <LimitContainer>
          {isDemo && (
            <DemoBadge>
              <Sparkles />
              <span>
                Demo Mode - {demoRemaining} of {demoLimit} remaining
              </span>
            </DemoBadge>
          )}

          {showDailyLimit && (
            <LimitBadge>
              <Zap />
              <span>
                {dailyRemaining} / {planLimits.dailyLimit} images today
              </span>
            </LimitBadge>
          )}

          {showScoopBalance && (
            <LimitBadge>
              <Coins />
              <span>
                {scoopBalance} {hasBackupScoops ? 'backup ' : ''}scoop
                {scoopBalance !== 1 ? 's' : ''} available
              </span>
            </LimitBadge>
          )}

          {showUnlimited && (
            <UnlimitedBadge>
              <InfinityIcon />
              <span>Unlimited Processing</span>
            </UnlimitedBadge>
          )}

          {isNearLimit && !showUnlimited && (
            <WarningBanner>
              <AlertTriangle />
              <WarningText>
                You&apos;re running low on images! {dailyRemaining} remaining
                today
                {hasBackupScoops && scoopBalance > 0
                  ? `, plus ${scoopBalance} backup scoop${scoopBalance !== 1 ? 's' : ''}`
                  : ''}
                .
              </WarningText>
              {!hasBackupScoops ? (
                <UpgradeButton onClick={() => navigate('/plan-selection')}>
                  Upgrade
                </UpgradeButton>
              ) : (
                <UpgradeButton
                  onClick={() => navigate('/checkout?plan=payAsYouGo')}
                >
                  Buy More Scoops
                </UpgradeButton>
              )}
            </WarningBanner>
          )}

          {showScoopBalance && scoopBalance < 10 && (
            <WarningBanner>
              <AlertTriangle />
              <WarningText>
                Running low on scoops! Only {scoopBalance} remaining.
              </WarningText>
              <UpgradeButton
                onClick={() => navigate('/checkout?plan=payAsYouGo')}
              >
                Buy More
              </UpgradeButton>
            </WarningBanner>
          )}
        </LimitContainer>
      </HeroContent>
    </HeroSection>
  );
};

export default ProcessHero;
