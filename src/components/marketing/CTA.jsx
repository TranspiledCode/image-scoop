import React from 'react';
import styled from '@emotion/styled';

const Section = styled.section`
  padding: 100px 48px;
  background: linear-gradient(135deg, #fef3f3 0%, #fdf4e3 50%, #f0fdf4 100%);
  text-align: center;
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 44px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 20px;

  span {
    background: linear-gradient(135deg, #ec4899 0%, #f97316 50%, #84cc16 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }
`;



const CTA = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Section>
      <Content>
        <Title>
          Ready to <span>optimize</span>?
        </Title>
        <Description>
          Join thousands of creators and developers who trust Image Scoop for
          their image optimization needs.
        </Description>
        <Button onClick={() => scrollToSection('hero')}>
          Start Optimizing — It&apos;s Free
        </Button>
      </Content>
    </Section>
  );
};

export default CTA;
