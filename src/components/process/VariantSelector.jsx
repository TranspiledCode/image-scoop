// src/components/process/VariantSelector.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Check } from 'lucide-react';
import processTheme from '../../style/processTheme';

const Container = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${processTheme.textPrimary};
  margin-bottom: 12px;
`;

const VariantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const VariantOption = styled.button`
  position: relative;
  padding: 16px 12px;
  background: ${({ selected }) =>
    selected ? processTheme.primaryGradient : '#1f2937'};
  border: 2px solid
    ${({ selected }) => (selected ? 'transparent' : processTheme.borderDefault)};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: ${({ selected }) =>
      selected ? processTheme.primaryGradient : '#374151'};
    transform: translateY(-2px);
    box-shadow: ${({ selected }) =>
      selected
        ? '0 6px 20px rgba(16, 185, 129, 0.4)'
        : '0 4px 12px rgba(0, 0, 0, 0.2)'};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid ${processTheme.primary};
    outline-offset: 2px;
  }
`;

const CheckIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ selected }) => (selected ? 1 : 0)};
  transition: opacity 0.2s;

  svg {
    width: 14px;
    height: 14px;
    color: ${processTheme.textPrimary};
  }
`;

const VariantName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${processTheme.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VariantSize = styled.div`
  font-size: 12px;
  color: ${({ selected }) =>
    selected ? 'rgba(255, 255, 255, 0.9)' : processTheme.textSecondary};
  font-weight: 500;
`;

const HintText = styled.p`
  font-size: 12px;
  color: ${processTheme.textMuted};
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const ErrorText = styled.p`
  font-size: 12px;
  color: #ef4444;
  margin: 8px 0 0 0;
  font-weight: 500;
`;

const VARIANT_OPTIONS = [
  { key: 't', name: 'Tiny', maxDimension: 100 },
  { key: 's', name: 'Small', maxDimension: 300 },
  { key: 'm', name: 'Medium', maxDimension: 500 },
  { key: 'l', name: 'Large', maxDimension: 800 },
  { key: 'xl', name: 'X-Large', maxDimension: 1000 },
  { key: 'xxl', name: 'XX-Large', maxDimension: 1200 },
];

// Calculate dimensions based on aspect ratio
const calculateDimensions = (maxDimension, aspectRatio) => {
  if (aspectRatio === 'original') {
    return `${maxDimension}px max`;
  }

  // Parse aspect ratio (e.g., "1:1", "16:9", "4:3")
  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);

  if (widthRatio === heightRatio) {
    // Square
    return `${maxDimension}×${maxDimension}`;
  } else if (widthRatio > heightRatio) {
    // Landscape
    const height = Math.round(maxDimension * (heightRatio / widthRatio));
    return `${maxDimension}×${height}`;
  } else {
    // Portrait
    const width = Math.round(maxDimension * (widthRatio / heightRatio));
    return `${width}×${maxDimension}`;
  }
};

const VariantSelector = ({
  selectedVariants,
  onChange,
  aspectRatio = 'original',
}) => {
  const toggleVariant = (key) => {
    const newSelection = selectedVariants.includes(key)
      ? selectedVariants.filter((v) => v !== key)
      : [...selectedVariants, key];

    // Ensure at least one variant is selected
    if (newSelection.length > 0) {
      onChange(newSelection);
    }
  };

  const allSelected = selectedVariants.length === VARIANT_OPTIONS.length;
  const noneSelected = selectedVariants.length === 0;

  return (
    <Container>
      <Label>Select Variant Sizes</Label>
      <VariantGrid>
        {VARIANT_OPTIONS.map((variant) => {
          const isSelected = selectedVariants.includes(variant.key);
          const dimensions = calculateDimensions(
            variant.maxDimension,
            aspectRatio,
          );
          return (
            <VariantOption
              key={variant.key}
              type="button"
              selected={isSelected}
              onClick={() => toggleVariant(variant.key)}
              aria-label={`${variant.name} variant (${dimensions})`}
              aria-pressed={isSelected}
            >
              <CheckIcon selected={isSelected}>
                <Check />
              </CheckIcon>
              <VariantName>{variant.key}</VariantName>
              <VariantSize selected={isSelected}>{dimensions}</VariantSize>
            </VariantOption>
          );
        })}
      </VariantGrid>
      {noneSelected ? (
        <ErrorText>At least one variant must be selected</ErrorText>
      ) : (
        <HintText>
          {selectedVariants.length} of {VARIANT_OPTIONS.length} variants
          selected
          {!allSelected && ' • Click to toggle'}
        </HintText>
      )}
    </Container>
  );
};

VariantSelector.propTypes = {
  selectedVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  aspectRatio: PropTypes.string,
};

export default VariantSelector;
