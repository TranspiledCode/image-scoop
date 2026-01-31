import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { XCircle, X, AlertCircle, Clock, FileX, Layers } from 'lucide-react';
import processTheme from '../../style/processTheme';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${processTheme.cardBackground};
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 24px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: ${processTheme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${processTheme.textPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ type }) =>
    type === 'trial' || type === 'subscription_ended'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(251, 146, 60, 0.15)'};
  color: ${({ type }) =>
    type === 'trial' || type === 'subscription_ended' ? '#3b82f6' : '#fb923c'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const ErrorTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${processTheme.textPrimary};
  text-align: center;
  margin: 0 0 12px 0;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: ${processTheme.textSecondary};
  text-align: center;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const UpgradeSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const UpgradeTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${processTheme.textPrimary};
  margin-bottom: 12px;
  text-align: center;
`;

const PlanComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const PlanCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
`;

const PlanName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${processTheme.textPrimary};
  margin-bottom: 4px;
`;

const PlanFeature = styled.div`
  font-size: 12px;
  color: ${processTheme.textSecondary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: transparent;
  color: ${processTheme.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${processTheme.textPrimary};
  }
`;

const LIMIT_CONFIG = {
  daily: {
    icon: Clock,
    title: 'Daily Limit Reached',
    upgrade: {
      title: 'Upgrade for More',
      plans: [
        { name: 'Plus', feature: '100/day' },
        { name: 'Pro', feature: 'Unlimited' },
      ],
    },
  },
  batch: {
    icon: Layers,
    title: 'Batch Size Limit',
    upgrade: {
      title: 'Process More at Once',
      plans: [
        { name: 'Plus', feature: '10 images' },
        { name: 'Pro', feature: '25 images' },
      ],
    },
  },
  fileSize: {
    icon: FileX,
    title: 'File Size Limit',
    upgrade: {
      title: 'Larger File Support',
      plans: [
        { name: 'Plus', feature: '20MB files' },
        { name: 'Pro', feature: '50MB files' },
      ],
    },
  },
  scoops: {
    icon: AlertCircle,
    title: 'Not Enough Scoops',
    upgrade: {
      title: 'Buy More Scoops',
      plans: [
        { name: '100 pack', feature: '$5' },
        { name: '600 pack', feature: '$20' },
      ],
    },
  },
  trial_expired: {
    icon: Clock,
    title: 'Trial Expired',
    upgrade: {
      title: 'Continue Processing',
      plans: [
        { name: 'Plus', feature: '$5/month' },
        { name: 'Pro', feature: '$10/month' },
      ],
    },
  },
  subscription_ended: {
    icon: XCircle,
    title: 'Subscription Ended',
    upgrade: {
      title: 'Reactivate Your Plan',
      plans: [
        { name: 'Plus', feature: '$5/month' },
        { name: 'Pro', feature: '$10/month' },
      ],
    },
  },
};

const LimitErrorModal = ({ limitType, reason, onClose }) => {
  const navigate = useNavigate();
  const config = LIMIT_CONFIG[limitType] || LIMIT_CONFIG.daily;
  const IconComponent = config.icon;

  const handleUpgrade = () => {
    if (limitType === 'scoops') {
      navigate('/checkout?plan=payAsYouGo');
    } else {
      navigate('/plan-selection');
    }
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X />
        </CloseButton>

        <ErrorIcon type={limitType}>
          <IconComponent />
        </ErrorIcon>

        <ErrorTitle>{config.title}</ErrorTitle>
        <ErrorMessage>{reason}</ErrorMessage>

        <UpgradeSection>
          <UpgradeTitle>{config.upgrade.title}</UpgradeTitle>

          <PlanComparison>
            {config.upgrade.plans.map((plan, index) => (
              <PlanCard key={index}>
                <PlanName>{plan.name}</PlanName>
                <PlanFeature>{plan.feature}</PlanFeature>
              </PlanCard>
            ))}
          </PlanComparison>
        </UpgradeSection>

        <ButtonGroup>
          <PrimaryButton onClick={handleUpgrade}>
            {limitType === 'scoops' ? 'Buy Scoops' : 'Upgrade Now'}
          </PrimaryButton>
          <SecondaryButton onClick={onClose}>Maybe Later</SecondaryButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

LimitErrorModal.propTypes = {
  limitType: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LimitErrorModal;
