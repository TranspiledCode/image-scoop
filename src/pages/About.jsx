// src/components/AboutPage.jsx
import React from 'react';
import styled from '@emotion/styled';
import {
  IceCream,
  Image,
  Upload,
  Download,
  ArrowRight,
  Gauge,
  FileType,
} from 'lucide-react';

const AboutContainer = styled.div`
  max-width: 80rem;
  width: 100%;
  margin: 3rem auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    margin: 7rem auto;
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.secondaryLight};
`;

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 1.5rem;
`;

const StepContainer = styled.div`
  margin: 2rem 0;
`;

const Step = styled.div`
  display: flex;
  margin-bottom: 2rem;
  position: relative;
`;

const StepNumber = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1.5rem;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const FormatContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const FormatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 1rem;
  padding: 1.5rem;
  width: calc(50% - 0.75rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormatTitle = styled.h4`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormatDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 0.5rem;
`;

const TipBox = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiaryLight};
  border-left: 4px solid ${({ theme }) => theme.colors.tertiary};
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 0.5rem;
`;

const TipTitle = styled.h4`
  color: ${({ theme }) => theme.colors.tertiaryDark};
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipText = styled.p`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 1.1rem;
  line-height: 1.5;
`;

const ImageTypeList = styled.ul`
  margin: 1rem 0;
  padding-left: 1.5rem;
  list-style-type: none;
`;

const ImageTypeItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '•';
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
    display: inline-block;
    width: 1em;
  }
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <Title>
        <IceCream size={32} />
        About Pixel Pushup
      </Title>

      <Description>
        Pixel Pushup is a simple, fast, and efficient tool for optimizing your
        images for the web. It helps reduce file sizes while maintaining
        quality, making your websites load faster and providing a better user
        experience.
      </Description>

      <Subtitle>What Does Pixel Pushup Do?</Subtitle>

      <Description>
        Pixel Pushup takes your uploaded images and converts them to modern,
        web-optimized formats like WebP, which offer superior compression and
        quality compared to traditional formats like JPEG and PNG. This results
        in smaller file sizes without noticeable loss in quality.
      </Description>

      <TipBox>
        <TipTitle>
          <Gauge size={20} />
          Why This Matters
        </TipTitle>
        <TipText>
          Smaller image files mean faster page loads, which improves user
          experience and SEO rankings. Modern image formats like WebP can reduce
          file size by up to 30% compared to JPEG or PNG while maintaining the
          same visual quality.
        </TipText>
      </TipBox>

      <Subtitle>How to Use Pixel Pushup</Subtitle>

      <StepContainer>
        <Step>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>
              <Upload size={22} />
              Upload Your Images
            </StepTitle>
            <StepDescription>
              Drag and drop your images into the upload area, or click to browse
              your files. You can upload up to 5 images at once.
            </StepDescription>

            <ImageTypeList>
              <ImageTypeItem>
                <FileType size={18} />
                Supported formats: JPEG, PNG, WebP
              </ImageTypeItem>
              <ImageTypeItem>
                <Image size={18} />
                Maximum file size: 10MB per image
              </ImageTypeItem>
            </ImageTypeList>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>
              <ArrowRight size={22} />
              Choose Your Output Format
            </StepTitle>
            <StepDescription>
              Select the output format you want to convert your images to.
              Different formats offer different benefits.
            </StepDescription>

            <FormatContainer>
              <FormatCard>
                <FormatTitle>WebP</FormatTitle>
                <FormatDescription>
                  Googles modern image format that provides superior lossless
                  and lossy compression for web images. Offers the best balance
                  of size and quality.
                </FormatDescription>
              </FormatCard>

              <FormatCard>
                <FormatTitle>PNG</FormatTitle>
                <FormatDescription>
                  Lossless format ideal for images with transparency, logos, or
                  graphics with text. Larger file size but maintains perfect
                  quality.
                </FormatDescription>
              </FormatCard>

              <FormatCard>
                <FormatTitle>JPEG</FormatTitle>
                <FormatDescription>
                  Widely compatible format best for photographs and complex
                  images without transparency. Good compression but may lose
                  some quality.
                </FormatDescription>
              </FormatCard>

              <FormatCard>
                <FormatTitle>AVIF</FormatTitle>
                <FormatDescription>
                  Next-generation image format with excellent compression and
                  quality. Smaller than WebP but with less browser support.
                </FormatDescription>
              </FormatCard>
            </FormatContainer>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>
              <Download size={22} />
              Process and Download
            </StepTitle>
            <StepDescription>
              Click the Process Images button to start the optimization. Once
              complete, the optimized images will be available for download. You
              will see the file size reduction for each image.
            </StepDescription>
          </StepContent>
        </Step>
      </StepContainer>

      <TipBox>
        <TipTitle>Pro Tip</TipTitle>
        <TipText>
          WebP is recommended for most use cases as it provides excellent
          compression with high quality. If you need maximum compatibility with
          older browsers, choose JPEG for photos or PNG for graphics.
        </TipText>
      </TipBox>

      <Subtitle>Technical Details</Subtitle>

      <Description>
        Pixel Pushup processes your images entirely in the browser - no server
        uploads required. This means your images never leave your computer,
        providing better privacy and faster processing. The tool uses advanced
        compression algorithms to optimize your images while maintaining the
        best quality possible for the selected output format.
      </Description>

      <Description>
        The optimized images maintain their original dimensions but with
        significantly reduced file sizes. All processing is done client-side
        using modern web technologies, making Pixel Pushup fast, secure, and
        easy to use.
      </Description>
    </AboutContainer>
  );
};

export default AboutPage;
