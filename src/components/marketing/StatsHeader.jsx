import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { TrendingUp } from 'lucide-react';

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

const getDynamicTitle = (userCount) => {
  if (userCount >= 1000000) {
    return 'Trusted by millions worldwide';
  } else if (userCount >= 1000) {
    return 'Trusted by thousands worldwide';
  } else if (userCount >= 100) {
    return 'Trusted by hundreds worldwide';
  } else {
    return 'Trusted by users worldwide';
  }
};

const StatsHeader = ({ totalUsers, loading }) => {
  const title = loading
    ? 'Trusted by users worldwide'
    : getDynamicTitle(totalUsers);

  return (
    <Header>
      <Badge>
        <TrendingUp size={16} />
        Stats
      </Badge>
      <Title>{title}</Title>
      <Subtitle>
        Join the growing community of creators and developers optimizing
        millions of images every month.
      </Subtitle>
    </Header>
  );
};

StatsHeader.propTypes = {
  totalUsers: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default React.memo(StatsHeader);
