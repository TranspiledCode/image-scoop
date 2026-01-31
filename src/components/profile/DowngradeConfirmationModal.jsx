import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AlertTriangle, X } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
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
  background: rgba(0, 0, 0, 0.05);
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #1f2937;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const WarningIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(251, 146, 60, 0.1);
  color: #fb923c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin: 0 0 12px 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin: 0 0 8px 0;
`;

const EffectiveDate = styled.p`
  font-size: 14px;
  color: #1f2937;
  text-align: center;
  font-weight: 600;
  margin: 0 0 24px 0;
`;

const InfoBox = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #1e40af;
  line-height: 1.5;
  margin: 0;

  strong {
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
    }
  `
      : `
    background: transparent;
    color: #6b7280;
    border: 1px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
      color: #1f2937;
      border-color: #d1d5db;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const DowngradeConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  newPlan,
  effectiveDate,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} disabled={isProcessing}>
          <X />
        </CloseButton>

        <WarningIcon>
          <AlertTriangle />
        </WarningIcon>

        <Title>Downgrade to {newPlan}?</Title>

        <Message>
          Your {currentPlan} plan will remain active until the end of your
          current billing period.
        </Message>

        <EffectiveDate>
          Effective Date: {formatDate(effectiveDate)}
        </EffectiveDate>

        <InfoBox>
          <InfoText>
            <strong>What happens next:</strong> You&apos;ll continue to enjoy
            all {currentPlan} plan features until {formatDate(effectiveDate)}.
            After that, your plan will automatically change to {newPlan} with
            its features and limits.
          </InfoText>
        </InfoBox>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? 'Scheduling...' : 'Confirm Downgrade'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

DowngradeConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  currentPlan: PropTypes.string.isRequired,
  newPlan: PropTypes.string.isRequired,
  effectiveDate: PropTypes.number.isRequired,
  isProcessing: PropTypes.bool,
};

export default DowngradeConfirmationModal;
