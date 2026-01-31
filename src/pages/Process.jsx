import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { AlertCircle } from 'lucide-react';
import UploadFormWizard from '../components/UploadFormWizard';
import ProcessHero from '../components/process/ProcessHero';
import DemoConversionModal from '../components/process/DemoConversionModal';
import processTheme from '../style/processTheme';
import { useUserSubscription } from '../hooks/useUserSubscription';
import { useProcessingLimits } from '../hooks/useProcessingLimits';

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

const IncompleteBanner = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 16px 24px;
  margin: 0 clamp(24px, 5vw, 48px) 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);

  svg {
    color: #f59e0b;
    flex-shrink: 0;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    margin: 0 20px 20px;
    padding: 14px 18px;
    gap: 12px;
  }
`;

const BannerContent = styled.div`
  flex: 1;
`;

const BannerTitle = styled.div`
  font-weight: 700;
  color: #92400e;
  margin-bottom: 4px;
  font-size: 15px;
`;

const BannerText = styled.div`
  font-size: 14px;
  color: #78350f;
`;

const CompleteButton = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const Process = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preUploadedFiles = location.state?.files || [];
  const { subscription, loading } = useUserSubscription();
  const { isDemo, isDemoLimitReached, demoRemaining, demoLimit } =
    useProcessingLimits();

  const [showConversionModal, setShowConversionModal] = useState(false);

  const showIncompleteBanner =
    !loading &&
    !isDemo &&
    (!subscription || subscription.status === 'incomplete');

  // Show conversion modal if demo limit reached
  useEffect(() => {
    if (isDemoLimitReached) {
      setShowConversionModal(true);
    }
  }, [isDemoLimitReached]);

  return (
    <ProcessPage>
      <BackgroundPattern />
      <PageContent>
        <ProcessHero />
        {showIncompleteBanner && (
          <IncompleteBanner>
            <AlertCircle size={24} />
            <BannerContent>
              <BannerTitle>Complete Your Plan Setup</BannerTitle>
              <BannerText>
                Choose a plan to unlock all features and start processing
                images.
              </BannerText>
            </BannerContent>
            <CompleteButton onClick={() => navigate('/plan-selection')}>
              Choose Plan
            </CompleteButton>
          </IncompleteBanner>
        )}
        <ProcessContent>
          <UploadFormWizard
            preUploadedFiles={preUploadedFiles}
            onDemoLimitReached={() => setShowConversionModal(true)}
          />
        </ProcessContent>
      </PageContent>

      <DemoConversionModal
        show={showConversionModal}
        onClose={() => setShowConversionModal(false)}
        imagesProcessed={demoLimit - demoRemaining}
      />
    </ProcessPage>
  );
};

export default Process;
