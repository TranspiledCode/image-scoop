import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import UploadFormWizard from '../components/UploadFormWizard';
import ProcessHero from '../components/process/ProcessHero';
import processTheme from '../style/processTheme';

const ProcessPage = styled.div`
  min-height: 100vh;
  background: ${processTheme.pageBackground};
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
`;

const PageContent = styled.div`
  position: relative;
  z-index: 1;
`;

const ProcessContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) clamp(24px, 5vw, 48px);

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 30px 20px;
  }
`;

const Process = () => {
  const location = useLocation();
  const preUploadedFiles = location.state?.files || [];

  return (
    <ProcessPage>
      <BackgroundPattern />
      <PageContent>
        <ProcessHero />
        <ProcessContent>
          <UploadFormWizard preUploadedFiles={preUploadedFiles} />
        </ProcessContent>
      </PageContent>
    </ProcessPage>
  );
};

export default Process;
