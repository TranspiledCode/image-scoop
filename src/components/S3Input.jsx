// src/components/S3Input.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const S3InputContainer = styled.div`
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
  border: 1px solid ${({ theme }) => theme.colors.gray};
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
    color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const S3Input = ({
  bucketName,
  setBucketName,
  loading = false,
}) => (
  <S3InputContainer>
    <InputLabel htmlFor="s3-bucket-name">S3 Bucket Name</InputLabel>
    <Input
      id="s3-bucket-name"
      type="text"
      value={bucketName}
      onChange={(e) => setBucketName(e.target.value)}
      placeholder="transpiled"
      disabled={loading}
    />
  </S3InputContainer>
);

S3Input.propTypes = {
  bucketName: PropTypes.string.isRequired,
  setBucketName: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default S3Input;
