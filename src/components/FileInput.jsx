// components/FileInput.jsx
import React from 'react';
import styled from '@emotion/styled';

const InputLabel = styled.label`
  display: block;
  margin-bottom: 15px;
`;

const FileInputField = styled.input`
  width: 100%;
`;

const FileInput = ({ handleFileChange }) => (
  <InputLabel>
    Select Images:
    <FileInputField type='file' multiple onChange={handleFileChange} />
  </InputLabel>
);

export default FileInput;
