import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { IceCream } from 'lucide-react';

const FooterSection = styled.footer`
  background: #111827;
  padding: 80px 48px 40px;
  color: white;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const FooterBrand = styled.div``;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 16px;
`;

const LogoText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 50%, #84cc16 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoIcon = styled(IceCream)`
  color: #ec4899;
  width: 24px;
  height: 24px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.7;
  margin-bottom: 24px;
`;

const ColumnTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FooterLink = styled(Link)`
  display: block;
  font-size: 14px;
  color: #9ca3af;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;

  &:hover {
    color: #f9a8d4;
  }
`;

const ExternalLink = styled.a`
  display: block;
  font-size: 14px;
  color: #9ca3af;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;

  &:hover {
    color: #f9a8d4;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const TranspiledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #f9a8d4;
  }
`;

const TranspiledLogo = styled.img`
  width: 14px;
  height: 14px;
  opacity: 0.8;
  transition: opacity 0.2s;

  ${TranspiledLink}:hover & {
    opacity: 1;
  }
`;

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <FooterSection>
      <Content>
        <FooterGrid>
          <FooterColumn>
            <FooterBrand>
              <Logo>
                <LogoIcon />
                <LogoText>Image Scoop</LogoText>
              </Logo>
              <Description>
                Optimize, compress, and convert your images. No quality loss,
                just smaller files that load faster.
              </Description>
            </FooterBrand>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Product</ColumnTitle>
            <FooterLink to="/" onClick={() => scrollToSection('features')}>
              Features
            </FooterLink>
            <FooterLink to="/" onClick={() => scrollToSection('how-it-works')}>
              How it works
            </FooterLink>

            {/* <FooterLink to="/" onClick={() => scrollToSection('pricing')}>
              Pricing
            </FooterLink> */}
            {/* <FooterLink to="/" onClick={() => scrollToSection('api')}>
              API
            </FooterLink> */}
            <FooterLink to="/" onClick={() => scrollToSection('faq')}>
              FAQ
            </FooterLink>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Company</ColumnTitle>
            <FooterLink to="/about">About</FooterLink>
            <ExternalLink
              href="https://transpiled.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Transpiled
            </ExternalLink>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Account</ColumnTitle>
            <FooterLink to="/login">Login</FooterLink>
            {/* <FooterLink to="/signup">Sign Up</FooterLink> */}
            {/* <FooterLink to="/process">Get Started</FooterLink> */}
          </FooterColumn>
        </FooterGrid>

        <FooterBottom>
          <Copyright>© 2025 Image Scoop. All rights reserved.</Copyright>
          <TranspiledLink
            href="https://transpiled.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TranspiledLogo
              src="https://imagedelivery.net/AjKAvtYVvwYZJx-5TwXk4w/transpiled/icon-white/thumbnail"
              alt="Transpiled"
            />
            A Transpiled App
          </TranspiledLink>
        </FooterBottom>
      </Content>
    </FooterSection>
  );
};

export default Footer;
