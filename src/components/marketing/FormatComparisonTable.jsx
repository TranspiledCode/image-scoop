import React from 'react';
import styled from '@emotion/styled';
import { Check, Minus } from 'lucide-react';

const TableContainer = styled.div`
  overflow-x: auto;
  margin: 48px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
`;

const Th = styled.th`
  padding: 20px 24px;
  text-align: left;
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:first-of-type {
    width: 30%;
  }
`;

const Tbody = styled.tbody`
  tr:nth-of-type(even) {
    background: #f9fafb;
  }
`;

const Td = styled.td`
  padding: 20px 24px;
  font-size: 15px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;

  &:first-of-type {
    font-weight: 600;
    color: #1f2937;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ positive }) => (positive ? '#10b981' : '#6b7280')};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ variant }) => {
    switch (variant) {
      case 'excellent':
        return 'rgba(16, 185, 129, 0.1)';
      case 'superior':
        return 'rgba(236, 72, 153, 0.1)';
      case 'good':
        return 'rgba(59, 130, 246, 0.1)';
      case 'moderate':
        return 'rgba(251, 146, 60, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${({ variant }) => {
    switch (variant) {
      case 'excellent':
        return '#10b981';
      case 'superior':
        return '#ec4899';
      case 'good':
        return '#3b82f6';
      case 'moderate':
        return '#fb923c';
      default:
        return '#6b7280';
    }
  }};
`;

const formats = [
  {
    name: 'WebP',
    compression: 'excellent',
    support: '95%',
    transparency: true,
    bestFor: 'Modern websites',
  },
  {
    name: 'AVIF',
    compression: 'superior',
    support: '85%',
    transparency: true,
    bestFor: 'Next-gen sites',
  },
  {
    name: 'JPEG',
    compression: 'good',
    support: '100%',
    transparency: false,
    bestFor: 'Universal compatibility',
  },
  {
    name: 'PNG',
    compression: 'moderate',
    support: '100%',
    transparency: true,
    bestFor: 'Transparency needed',
  },
];

const FormatComparisonTable = () => {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <tr>
            <Th>Format</Th>
            <Th>Compression</Th>
            <Th>Browser Support</Th>
            <Th>Transparency</Th>
            <Th>Best For</Th>
          </tr>
        </Thead>
        <Tbody>
          {formats.map((format, index) => (
            <tr key={index}>
              <Td>{format.name}</Td>
              <Td>
                <Badge variant={format.compression}>
                  {format.compression.charAt(0).toUpperCase() +
                    format.compression.slice(1)}
                </Badge>
              </Td>
              <Td>{format.support}</Td>
              <Td>
                <IconWrapper positive={format.transparency}>
                  {format.transparency ? <Check /> : <Minus />}
                  {format.transparency ? 'Yes' : 'No'}
                </IconWrapper>
              </Td>
              <Td>{format.bestFor}</Td>
            </tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default FormatComparisonTable;
