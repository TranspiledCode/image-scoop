import React from 'react';
import styled from '@emotion/styled';
import { Folder, FileImage } from 'lucide-react';

const TreeContainer = styled.div`
  background: #1f2937;
  border-radius: 16px;
  padding: 32px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 14px;
  color: #e5e7eb;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  margin: 0 auto;
`;

const TreeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  padding-left: ${({ indent }) => indent * 24}px;
  color: ${({ isFolder }) => (isFolder ? '#60a5fa' : '#a78bfa')};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const FileName = styled.span`
  color: ${({ isFolder }) => (isFolder ? '#60a5fa' : '#e5e7eb')};
`;

const SizeLabel = styled.span`
  color: #9ca3af;
  font-size: 12px;
  margin-left: auto;
`;

const FileTreePreview = () => {
  const files = [
    { name: 'your-image-name/', isFolder: true, indent: 0 },
    { name: 'xl.webp', size: '1920px', indent: 1 },
    { name: 'lg.webp', size: '1280px', indent: 1 },
    { name: 'md.webp', size: '768px', indent: 1 },
    { name: 'sm.webp', size: '480px', indent: 1 },
  ];

  return (
    <TreeContainer>
      {files.map((file, index) => (
        <TreeItem key={index} indent={file.indent} isFolder={file.isFolder}>
          {file.isFolder ? <Folder /> : <FileImage />}
          <FileName isFolder={file.isFolder}>{file.name}</FileName>
          {file.size && <SizeLabel>{file.size}</SizeLabel>}
        </TreeItem>
      ))}
    </TreeContainer>
  );
};

export default FileTreePreview;
