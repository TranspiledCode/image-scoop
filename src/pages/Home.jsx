import styled from '@emotion/styled';

import UploadFormWizard from 'components/UploadFormWizard';

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.vanilla};
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.white + '80'};
  backdrop-filter: blur(10px);
  z-index: 50;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const Home = () => {
  return (
    <StyledHome>
      <UploadFormWizard />
      <Footer>
        © {new Date().getFullYear()} Image Scoop •
        <FooterLink
          href="https://transpiled.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          A Transpiled App
        </FooterLink>
        !
      </Footer>
    </StyledHome>
  );
};

export default Home;
