// components/ProgressBar.jsx
import React from 'react';
import styled from '@emotion/styled';

const BarContainer = styled.div`
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 2px;
  margin-top: 5px;
`;

const Bar = styled.div`
  width: ${(props) => props.percentage}%;
  height: 8px;
  background-color: #007bff;
  border-radius: 2px;
  transition: width 0.2s ease;
`;

const ProgressBar = ({ percentage }) => (
  <BarContainer>
    <Bar percentage={percentage} />
  </BarContainer>
);

export default ProgressBar;
