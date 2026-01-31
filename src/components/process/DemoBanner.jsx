import React from 'react';
import styled from '@emotion/styled';
import { Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';
import processTheme from '../../style/processTheme';

const BannerContainer = styled.div`
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 16px 24px;
  margin: 0 clamp(24px, 5vw, 48px) 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

  svg {
    color: #3b82f6;
    flex-shrink: 0;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    margin: 0 20px 20px;
    padding: 14px 18px;
    gap: 12px;
    flex-direction: column;
    text-align: center;
  }
`;

const BannerContent = styled.div`
  flex: 1;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const BannerTitle = styled.div`
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 4px;
  font-size: 15px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    margin-bottom: 2px;
  }
`;

const BannerText = styled.div`
  font-size: 14px;
  color: #1e3a8a;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 13px;
  }
`;

const Counter = styled.div`
  background: white;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

const DemoBanner = ({ remaining, total }) => {
  return (
    <BannerContainer>
      <Sparkles size={24} />
      <BannerContent>
        <BannerTitle>Demo Mode - No signup required!</BannerTitle>
        <BannerText>
          Try our image optimizer for free. Sign up to unlock 20 images/day.
        </BannerText>
      </BannerContent>
      <Counter>
        {remaining} of {total} remaining
      </Counter>
    </BannerContainer>
  );
};

DemoBanner.propTypes = {
  remaining: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default DemoBanner;
