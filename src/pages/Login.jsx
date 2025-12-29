import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3f3 0%, #fdf4e3 50%, #f0fdf4 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 48px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
  text-align: center;
`;

const Message = styled.p`
  font-size: 15px;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: #ec4899;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;

  &:hover {
    color: #f97316;
  }
`;

const Login = () => {
  return (
    <PageContainer>
      <Card>
        <Title>Login</Title>
        <Subtitle>Welcome back!</Subtitle>
        <Message>
          The login functionality will be implemented in a future update. For
          now, you can use all features without an account.
        </Message>
        <div style={{ textAlign: 'center' }}>
          <BackLink to="/">← Back to Home</BackLink>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Login;
