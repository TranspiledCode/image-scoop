import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import UploadFormWizard from '../components/UploadFormWizard';

const ProcessPage = styled.div`
  min-height: 100vh;
  background: #fefefe;
`;

const Process = () => {
  const location = useLocation();
  const preUploadedFiles = location.state?.files || [];

  return (
    <ProcessPage>
      <UploadFormWizard preUploadedFiles={preUploadedFiles} />
    </ProcessPage>
  );
};

export default Process;
