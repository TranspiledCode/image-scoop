import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import UploadFormWizard from '../components/UploadFormWizard';
import { useAuth } from '../context/AuthContext';

const ProcessPage = styled.div`
  min-height: 100vh;
  background: #fefefe;
`;

const Process = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const preUploadedFiles = location.state?.files || [];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', {
        state: { returnUrl: '/process' },
        replace: true,
      });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <ProcessPage>
      <UploadFormWizard preUploadedFiles={preUploadedFiles} />
    </ProcessPage>
  );
};

export default Process;
