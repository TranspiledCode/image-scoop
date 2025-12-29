import React from 'react';
import styled from '@emotion/styled';
import { Code, Zap, Lock, Gauge } from 'lucide-react';

const Section = styled.section`
  padding: 100px 48px;
  background: linear-gradient(135deg, #fef3f3 0%, #fdf4e3 50%, #f0fdf4 100%);
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

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CodeBlock = styled.div`
  background: #1f2937;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: #111827;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const CodeHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const CodeContent = styled.pre`
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #d1d5db;
  overflow-x: auto;

  .keyword {
    color: #ec4899;
  }

  .string {
    color: #84cc16;
  }

  .function {
    color: #f97316;
  }

  .comment {
    color: #6b7280;
    font-style: italic;
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FeatureItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
`;

const ApiSection = () => {
  return (
    <Section id="api">
      <Container>
        <Header>
          <Badge>
            <Code size={16} />
            Developer API
          </Badge>
          <Title>Built for developers</Title>
          <Subtitle>
            Integrate image optimization into your workflow with our simple and
            powerful REST API.
          </Subtitle>
        </Header>

        <Content>
          <CodeBlock>
            <CodeHeader>
              <Dot color="#ef4444" />
              <Dot color="#eab308" />
              <Dot color="#84cc16" />
            </CodeHeader>
            <CodeContent>
              <span className="keyword">const</span> response ={' '}
              <span className="keyword">await</span>{' '}
              <span className="function">fetch</span>(
              <span className="string">
                &apos;https://api.imagescoop.com/v1/optimize&apos;
              </span>
              , {'{\n'}
              {'  '}
              <span className="keyword">method</span>:{' '}
              <span className="string">&apos;POST&apos;</span>,{'\n'}
              {'  '}
              <span className="keyword">headers</span>: {'{\n'}
              {'    '}
              <span className="string">&apos;Authorization&apos;</span>:{' '}
              <span className="string">&apos;Bearer YOUR_API_KEY&apos;</span>
              {'\n'}
              {'  '},{'\n'}
              {'  '}
              <span className="keyword">body</span>:{' '}
              <span className="function">formData</span>
              {'\n'}
              {'}'});{'\n\n'}
              <span className="keyword">const</span> data ={' '}
              <span className="keyword">await</span> response.
              <span className="function">json</span>();{'\n'}
              <span className="comment">{`// Get optimized image URL`}</span>
              {'\n'}
              console.<span className="function">log</span>(data.optimizedUrl);
            </CodeContent>
          </CodeBlock>

          <Features>
            <FeatureItem>
              <FeatureIcon gradient="linear-gradient(135deg, #ec4899 0%, #f97316 100%)">
                <Zap />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Lightning Fast</FeatureTitle>
                <FeatureDescription>
                  Process images in milliseconds with our globally distributed
                  infrastructure.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon gradient="linear-gradient(135deg, #f97316 0%, #eab308 100%)">
                <Lock />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Secure & Private</FeatureTitle>
                <FeatureDescription>
                  All API requests are encrypted and your images are
                  automatically deleted after processing.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon gradient="linear-gradient(135deg, #eab308 0%, #84cc16 100%)">
                <Gauge />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Scalable</FeatureTitle>
                <FeatureDescription>
                  From a few images to millions per day. Our API scales with
                  your needs.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          </Features>
        </Content>
      </Container>
    </Section>
  );
};

export default ApiSection;
