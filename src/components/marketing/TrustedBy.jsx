import React from 'react';
import styled from '@emotion/styled';

const Section = styled.section`
  padding: 60px 48px;
  background: white;
  text-align: center;
`;

const Text = styled.p`
  font-size: 13px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 32px;
`;

const Logos = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
  opacity: 0.4;
`;

const Logo = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #374151;
`;

const TrustedBy = () => {
  return (
    <Section>
      <Text>Trusted by teams at</Text>
      <Logos>
        <Logo>Spotify</Logo>
        <Logo>Airbnb</Logo>
        <Logo>Slack</Logo>
        <Logo>Notion</Logo>
        <Logo>Figma</Logo>
      </Logos>
    </Section>
  );
};

export default TrustedBy;
