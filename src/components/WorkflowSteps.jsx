// src/components/WorkflowSteps.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Upload, Settings, Zap, Download } from 'lucide-react';

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 3px;
  background: ${({ theme }) => theme.colors.lightGray};
  z-index: 0;
  transform: translateY(-50%);

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.5s ease;
  width: ${({ progress }) => progress}%;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
  }
`;

const StepIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ active, completed, theme }) =>
    completed
      ? theme.colors.success
      : active
        ? theme.colors.primary
        : theme.colors.lightGray};
  color: ${({ active, completed, theme }) =>
    completed || active ? theme.colors.white : theme.colors.gray};
  transition: all 0.3s ease;
  box-shadow: ${({ active, completed }) =>
    active || completed ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const StepLabel = styled.span`
  font-size: 0.9rem;
  font-weight: ${({ active }) => (active ? '600' : '500')};
  color: ${({ active, completed, theme }) =>
    completed || active ? theme.colors.black : theme.colors.gray};
  text-align: center;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const WorkflowSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Upload Files', icon: Upload },
    { id: 2, label: 'Configure', icon: Settings },
    { id: 3, label: 'Process', icon: Zap },
    { id: 4, label: 'Download', icon: Download },
  ];

  const getProgress = () => {
    if (currentStep === 1) return 0;
    if (currentStep === 2) return 33;
    if (currentStep === 3) return 66;
    if (currentStep === 4) return 100;
    return 0;
  };

  return (
    <StepsContainer>
      <ProgressLine>
        <ProgressFill progress={getProgress()} />
      </ProgressLine>
      {steps.map((step) => {
        const StepIconComponent = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <Step key={step.id}>
            <StepIcon active={isActive} completed={isCompleted}>
              <StepIconComponent />
            </StepIcon>
            <StepLabel active={isActive} completed={isCompleted}>
              {step.label}
            </StepLabel>
          </Step>
        );
      })}
    </StepsContainer>
  );
};

WorkflowSteps.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default WorkflowSteps;
