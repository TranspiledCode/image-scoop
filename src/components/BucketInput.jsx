// components/BucketInput.jsx
import React from 'react';
import styled from '@emotion/styled';

const InputLabel = styled.label`
  display: block;
  margin-bottom: 15px;
`;

const BucketInputField = styled.input`
  width: 100%;
`;

const BucketInput = ({ bucketLocation, setBucketLocation }) => (
  <InputLabel>
    Bucket Location:
    <BucketInputField
      type='text'
      placeholder='Enter bucket location'
      value={bucketLocation}
      onChange={(e) => setBucketLocation(e.target.value)}
    />
  </InputLabel>
);

export default BucketInput;
