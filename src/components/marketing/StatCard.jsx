import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Card = styled.div`
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

const Value = styled.div`
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #f9a8d4 0%, #fdba74 50%, #bef264 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1;
`;

const Label = styled.div`
  font-size: 15px;
  color: #9ca3af;
  font-weight: 500;
`;

const StatCard = ({ icon: Icon, gradient, value, label }) => {
  return (
    <Card>
      <IconWrapper gradient={gradient}>
        <Icon />
      </IconWrapper>
      <Value>{value}</Value>
      <Label>{label}</Label>
    </Card>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  gradient: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default React.memo(StatCard);
