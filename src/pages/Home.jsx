import styled from '@emotion/styled';

import UploadForm from 'components/UploadForm';

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.lightGray} 0%,
    ${({ theme }) => theme.colors.vanilla} 100%
  );
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  /* Ice cream themed background elements */
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: -150px;
    width: 300px;
    height: 300px;
    background-color: ${({ theme }) => theme.colors.primaryLight};
    border-radius: 50%;
    opacity: 0.05;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 10%;
    right: -100px;
    width: 250px;
    height: 250px;
    background-color: ${({ theme }) => theme.colors.secondaryLight};
    border-radius: 50%;
    opacity: 0.05;
    z-index: 0;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 2rem 4rem;
  margin-top: 15rem;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 0.875rem;
  margin-top: auto;
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
      <ContentContainer>
        <UploadForm />
      </ContentContainer>
      <Footer>
        © {new Date().getFullYear()} Pixel Pushup •{' '}
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
