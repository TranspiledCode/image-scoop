// Component to add to AboutSection.jsx
import React from 'react';
import styled from '@emotion/styled';
import { Zap, Package, Cpu, Maximize, Filter } from 'lucide-react';

const TechnicalContainer = styled.div`
  margin-top: 3rem;
  border-top: 2px dashed ${({ theme }) => theme.colors.lightGray};
  padding-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const TechCard = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h4`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardContent = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const CodeBlock = styled.pre`
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  padding: 1.25rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 1.5rem 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 1rem;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const TableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
`;

const Note = styled.p`
  font-size: 1.1rem;
`;

const TechnicalDetails = () => {
  return (
    <TechnicalContainer>
      <SectionTitle>
        <Cpu size={24} />
        Technical Specifications
      </SectionTitle>

      <p>
        Image Scoop uses advanced image processing techniques to optimize your
        images. Here is what happens behind the scenes when you process your
        images:
      </p>

      <TechGrid>
        <TechCard>
          <CardTitle>
            <Package size={18} />
            Output Package
          </CardTitle>
          <CardContent>
            All processed images are packaged into a ZIP file for easy download.
            Each original image is processed into multiple sizes, organized in
            separate folders.
          </CardContent>
        </TechCard>

        <TechCard>
          <CardTitle>
            <Maximize size={18} />
            Responsive Sizes
          </CardTitle>
          <CardContent>
            Each image is automatically resized into 6 different dimensions to
            support responsive web design, from thumbnail (100px) to extra large
            (1200px).
          </CardContent>
        </TechCard>

        <TechCard>
          <CardTitle>
            <Filter size={18} />
            Color Processing
          </CardTitle>
          <CardContent>
            All images are converted to the sRGB color space for consistent
            display across devices. Transparency is preserved in PNG and WebP
            formats.
          </CardContent>
        </TechCard>

        <TechCard>
          <CardTitle>
            <Zap size={18} />
            Optimization
          </CardTitle>
          <CardContent>
            Images are optimized with carefully tuned settings: JPEG (95%
            quality), PNG (level 6 compression), and WebP (90% quality) for an
            ideal balance.
          </CardContent>
        </TechCard>
      </TechGrid>

      <h4>Output Image Sizes</h4>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Size Label</TableHeader>
            <TableHeader>Dimensions</TableHeader>
            <TableHeader>Ideal Use Case</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          <TableRow>
            <TableCell>t (thumbnail)</TableCell>
            <TableCell>100×100px</TableCell>
            <TableCell>Avatars, thumbnails, previews</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>s (small)</TableCell>
            <TableCell>300×300px</TableCell>
            <TableCell>Small UI elements, previews</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>m (medium)</TableCell>
            <TableCell>500×500px</TableCell>
            <TableCell>Medium-sized content images</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>l (large)</TableCell>
            <TableCell>800×800px</TableCell>
            <TableCell>Large content images, cards</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>xl (extra large)</TableCell>
            <TableCell>1000×1000px</TableCell>
            <TableCell>Full-width images on medium screens</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>xxl (2x large)</TableCell>
            <TableCell>1200×1200px</TableCell>
            <TableCell>High-resolution displays, hero images</TableCell>
          </TableRow>
        </tbody>
      </Table>

      <h4>Example Output Structure</h4>
      <CodeBlock>
        {`processed_images.zip/
├── image1/
│   ├── t.webp    (thumbnail: 100×100px)
│   ├── s.webp    (small: 300×300px)
│   ├── m.webp    (medium: 500×500px)
│   ├── l.webp    (large: 800×800px)
│   ├── xl.webp   (extra large: 1000×1000px)
│   └── xxl.webp  (2x large: 1200×1200px)
├── image2/
│   ├── t.webp
│   ├── s.webp
│   └── ...
└── ...`}
      </CodeBlock>

      <Note>
        <strong>Note:</strong> All resizing maintains the original aspect ratio
        of your images and will not enlarge images beyond their original
        dimensions. The resizing uses the high-quality Lanczos3 algorithm for
        optimal results.
      </Note>

      <Note>
        <strong>Maximum size:</strong> The maximum allowed dimension for any
        image is 8000×8000 pixels.
      </Note>
    </TechnicalContainer>
  );
};

export default TechnicalDetails;
