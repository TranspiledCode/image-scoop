import styled from '@emotion/styled';

import Header from 'components/Header';
import UploadForm from 'components/UploadForm';

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  min-height: 100vh;
`;

const Home = () => {
  return (
    <StyledHome>
      <Header />
      <UploadForm />
    </StyledHome>
  );
};

export default Home;
