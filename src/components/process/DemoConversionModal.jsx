import React from 'react';
import styled from '@emotion/styled';
import { X, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 520px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 32px 24px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  svg {
    color: white;
  }

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
  margin-bottom: 12px;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: 24px;
  }
`;

const ComparisonGrid = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 28px;

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 24px;
  }
`;

const ComparisonTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

const PlanRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #e5e7eb;

  &:first-of-type {
    border-top: none;
  }

  @media (max-width: 480px) {
    padding: 8px 0;
  }
`;

const PlanName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;

  ${(props) =>
    props.highlighted &&
    `
    color: #ec4899;
  `}

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const PlanLimit = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;

  ${(props) =>
    props.highlighted &&
    `
    color: #10b981;
    font-weight: 600;
  `}

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const PrimaryCTA = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }

  @media (max-width: 480px) {
    padding: 14px 20px;
    font-size: 15px;
  }
`;

const SecondaryCTA = styled.button`
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 15px;
  }
`;

const DemoConversionModal = ({ show, onClose, imagesProcessed }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleSignUp = () => {
    navigate('/signup?returnUrl=/process');
  };

  const handleViewPlans = () => {
    // Navigate to marketing page and scroll to pricing
    navigate('/', { state: { scrollTo: 'pricing' } });
    setTimeout(() => {
      const element = document.getElementById('pricing');
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </CloseButton>

        <IconWrapper>
          <Sparkles size={32} />
        </IconWrapper>

        <Title>Nice work!</Title>
        <Description>
          You&apos;ve processed {imagesProcessed} image
          {imagesProcessed !== 1 ? 's' : ''}. Sign up free to get 20 images per
          day, or upgrade for even more.
        </Description>

        <ComparisonGrid>
          <ComparisonTitle>Compare Plans</ComparisonTitle>
          <PlanRow>
            <PlanName>Demo</PlanName>
            <PlanLimit>3 images total</PlanLimit>
          </PlanRow>
          <PlanRow>
            <PlanName highlighted>Free</PlanName>
            <PlanLimit highlighted>
              <Check size={16} />
              20 images/day
            </PlanLimit>
          </PlanRow>
          <PlanRow>
            <PlanName>Plus</PlanName>
            <PlanLimit>100 images/day</PlanLimit>
          </PlanRow>
          <PlanRow>
            <PlanName>Pro</PlanName>
            <PlanLimit>Unlimited</PlanLimit>
          </PlanRow>
          <PlanRow>
            <PlanName>Pay-as-you-go</PlanName>
            <PlanLimit>Buy scoops as needed</PlanLimit>
          </PlanRow>
        </ComparisonGrid>

        <CTAButtons>
          <PrimaryCTA onClick={handleSignUp}>Sign Up Free</PrimaryCTA>
          <SecondaryCTA onClick={handleViewPlans}>View All Plans</SecondaryCTA>
        </CTAButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

DemoConversionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imagesProcessed: PropTypes.number.isRequired,
};

export default DemoConversionModal;
