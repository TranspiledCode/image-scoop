import React from 'react';
import styled from '@emotion/styled';
import { Check, X } from 'lucide-react';

const Section = styled.section`
  padding: 100px 48px;
  background: white;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(236, 72, 153, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 44px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
`;

const Th = styled.th`
  padding: 24px;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);

  &:first-of-type {
    border-top-left-radius: 20px;
  }

  &:last-of-type {
    border-top-right-radius: 20px;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #f3f4f6;

  &:hover {
    background: #f9fafb;
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 20px 24px;
  font-size: 15px;
  color: #6b7280;

  &:first-of-type {
    font-weight: 600;
    color: #1f2937;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CheckIcon = styled(Check)`
  color: ${({ theme }) => theme.colors.tertiary};
`;

const XIcon = styled(X)`
  color: #ef4444;
`;

const HighlightCell = styled(Td)`
  background: linear-gradient(135deg, #fef3f3 0%, #fdf4e3 100%);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const comparisonData = [
  {
    feature: 'Batch Processing',
    imageScoop: true,
    competitor1: false,
    competitor2: true,
  },
  {
    feature: 'AI-Powered Compression',
    imageScoop: true,
    competitor1: false,
    competitor2: false,
  },
  {
    feature: 'Format Conversion',
    imageScoop: true,
    competitor1: true,
    competitor2: true,
  },
  {
    feature: 'API Access',
    imageScoop: true,
    competitor1: true,
    competitor2: false,
  },
  {
    feature: 'Privacy Guaranteed',
    imageScoop: true,
    competitor1: false,
    competitor2: true,
  },
  {
    feature: 'No File Size Limits',
    imageScoop: true,
    competitor1: false,
    competitor2: false,
  },
  {
    feature: 'Free Tier Available',
    imageScoop: true,
    competitor1: true,
    competitor2: false,
  },
];

const Comparison = () => {
  return (
    <Section>
      <Container>
        <Header>
          <Badge>Comparison</Badge>
          <Title>Why choose Image Scoop?</Title>
          <Subtitle>
            See how we stack up against the competition. Better features, better
            pricing, better results.
          </Subtitle>
        </Header>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>Feature</Th>
                <Th>Image Scoop</Th>
                <Th>Competitor A</Th>
                <Th>Competitor B</Th>
              </Tr>
            </Thead>
            <Tbody>
              {comparisonData.map((row, index) => (
                <Tr key={index}>
                  <Td>{row.feature}</Td>
                  <HighlightCell>
                    <IconWrapper>
                      {row.imageScoop ? <CheckIcon /> : <XIcon />}
                    </IconWrapper>
                  </HighlightCell>
                  <Td>
                    <IconWrapper>
                      {row.competitor1 ? <CheckIcon /> : <XIcon />}
                    </IconWrapper>
                  </Td>
                  <Td>
                    <IconWrapper>
                      {row.competitor2 ? <CheckIcon /> : <XIcon />}
                    </IconWrapper>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
      </Container>
    </Section>
  );
};

export default Comparison;
