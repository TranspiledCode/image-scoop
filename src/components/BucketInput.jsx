// src/components/BucketInput.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const BucketInputContainer = styled.div`
  margin-top: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 0.375rem;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.2);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightGray};
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.gray};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const BucketInput = ({
  bucketLocation,
  setBucketLocation,
  loading = false,
}) => (
  <BucketInputContainer>
    <InputLabel htmlFor="bucket-location">AWS Bucket Location</InputLabel>
    <Input
      id="bucket-location"
      type="text"
      value={bucketLocation}
      onChange={(e) => setBucketLocation(e.target.value)}
      placeholder="s3://my-bucket/path"
      disabled={loading}
    />
  </BucketInputContainer>
);

BucketInput.propTypes = {
  bucketLocation: PropTypes.string.isRequired,
  setBucketLocation: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default BucketInput;
