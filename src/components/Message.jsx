// src/components/Message.js
import styled from '@emotion/styled';

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: 500;

  ${(props) =>
    props.variant === 'error'
      ? `
    background-color: #FEE2E2;
    color: #B91C1C;
  `
      : `
    background-color: #ECFDF5;
    color: #047857;
  `}
`;

export default Message;
