import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ChevronDown, HelpCircle } from 'lucide-react';

const Section = styled.section`
  padding: 100px 48px;
  background: #f9fafb;
`;

const Container = styled.div`
  max-width: 800px;
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

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div`
  background: white;
  border-radius: 16px;
  border: 2px solid ${({ isOpen }) => (isOpen ? '#ec4899' : '#e5e7eb')};
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    border-color: ${({ isOpen }) => (isOpen ? '#ec4899' : '#f9a8d4')};
  }
`;

const Question = styled.button`
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const QuestionText = styled.span`
  flex: 1;
`;

const ChevronIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  flex-shrink: 0;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Answer = styled.div`
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const AnswerContent = styled.p`
  padding: 0 24px 24px;
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
`;

const faqs = [
  {
    question: 'What image formats do you support?',
    answer:
      'We support all major image formats including JPEG, PNG, WebP, GIF, SVG, AVIF, and more. You can also convert between formats during the optimization process.',
  },
  {
    question: 'How much can I reduce my image file sizes?',
    answer:
      'On average, our users see 60-70% reduction in file size while maintaining visual quality. The exact reduction depends on the original image format, content, and your quality settings.',
  },
  {
    question: 'Is my data secure and private?',
    answer:
      'Absolutely. All images are processed securely using encrypted connections. We automatically delete all uploaded images after 24 hours, and we never share or use your images for any other purpose.',
  },
  {
    question: 'Can I use this for commercial projects?',
    answer:
      'Yes! All our plans, including the free tier, can be used for commercial projects. For high-volume commercial use, we recommend our Pro or Enterprise plans for better performance and support.',
  },
  {
    question: 'Do you offer an API for developers?',
    answer:
      'Yes, our Pro and Enterprise plans include full API access with comprehensive documentation. You can integrate image optimization directly into your applications and workflows.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer:
      'On the free plan, you will need to wait until the next day to process more images. On paid plans, you can upgrade anytime or contact us for custom limits. We never charge overage fees without your consent.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq">
      <Container>
        <Header>
          <Badge>
            <HelpCircle size={16} />
            FAQ
          </Badge>
          <Title>Frequently asked questions</Title>
          <Subtitle>
            Everything you need to know about Image Scoop. Can&apos;t find what
            you&apos;re looking for? Contact our support team.
          </Subtitle>
        </Header>

        <FAQList>
          {faqs.map((faq, index) => (
            <FAQItem key={index} isOpen={openIndex === index}>
              <Question onClick={() => toggleFAQ(index)}>
                <QuestionText>{faq.question}</QuestionText>
                <ChevronIconWrapper $isOpen={openIndex === index}>
                  <ChevronDown />
                </ChevronIconWrapper>
              </Question>
              <Answer isOpen={openIndex === index}>
                <AnswerContent>{faq.answer}</AnswerContent>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  );
};

export default FAQ;
