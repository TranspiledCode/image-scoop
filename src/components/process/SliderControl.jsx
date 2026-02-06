// src/components/process/SliderControl.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Lock } from 'lucide-react';
import processTheme from '../../style/processTheme';

const ControlWrapper = styled.div`
  margin-bottom: 20px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  filter: ${({ disabled }) => (disabled ? 'blur(0.5px)' : 'none')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  transition: all 0.2s;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${processTheme.textPrimary};

  svg {
    width: 14px;
    height: 14px;
    color: ${processTheme.textMuted};
  }
`;

const ValueDisplay = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${processTheme.textSecondary};
  background: #1f2937;
  padding: 4px 12px;
  border-radius: 6px;
  min-width: 50px;
  text-align: center;
`;

const SliderTrack = styled.div`
  position: relative;
  width: 100%;
  height: 44px; /* Touch-friendly hit target */
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const SliderInput = styled.input`
  width: 100%;
  height: 8px;
  background: linear-gradient(
    to right,
    ${processTheme.primaryGradient} 0%,
    ${processTheme.primaryGradient}
      ${({ value, min, max }) => ((value - min) / (max - min)) * 100}%,
    #1f2937 ${({ value, min, max }) => ((value - min) / (max - min)) * 100}%,
    #1f2937 100%
  );
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;

  /* Thumb styling - Chrome/Safari */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${processTheme.primaryGradient};
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    transition: all 0.2s;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
  }

  /* Thumb styling - Firefox */
  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${processTheme.primaryGradient};
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    transition: all 0.2s;
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
  }

  /* Track styling - Firefox */
  &::-moz-range-track {
    background: transparent;
    border: none;
  }

  &:focus {
    outline: 2px solid ${processTheme.primary};
    outline-offset: 2px;
  }
`;

const TooltipText = styled.div`
  font-size: 12px;
  color: ${processTheme.textMuted};
  margin-top: 4px;
  line-height: 1.4;
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  bottom: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(2px);
  cursor: not-allowed;
  z-index: 1;

  &:hover .upgrade-hint {
    opacity: 1;
  }
`;

const UpgradeHint = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: ${processTheme.textPrimary};
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1f2937;
  }
`;

const SliderControl = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  locked = false,
  tooltip = '',
  upgradeMessage = '',
}) => {
  const handleChange = (e) => {
    if (!disabled && !locked) {
      onChange(Number(e.target.value));
    }
  };

  return (
    <ControlWrapper disabled={disabled || locked}>
      <LabelRow>
        <Label>
          {locked && <Lock />}
          {label}
        </Label>
        <ValueDisplay>{value}</ValueDisplay>
      </LabelRow>

      <SliderTrack disabled={disabled || locked}>
        {locked && (
          <LockedOverlay>
            <UpgradeHint className="upgrade-hint">
              {upgradeMessage || 'Unlock with Plus/Pro'}
            </UpgradeHint>
          </LockedOverlay>
        )}
        <SliderInput
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled || locked}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </SliderTrack>

      {tooltip && !locked && <TooltipText>{tooltip}</TooltipText>}
    </ControlWrapper>
  );
};

SliderControl.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  locked: PropTypes.bool,
  tooltip: PropTypes.string,
  upgradeMessage: PropTypes.string,
};

export default SliderControl;
