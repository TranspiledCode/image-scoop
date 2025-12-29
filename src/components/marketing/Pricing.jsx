import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Check, Zap } from 'lucide-react';

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
  margin-bottom: 48px;
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
  margin: 0 auto 32px;
  line-height: 1.6;
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
`;

const ToggleLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#1f2937' : '#9ca3af')};
  transition: color 0.2s;
`;

const ToggleSwitch = styled.button`
  width: 56px;
  height: 32px;
  background: ${({ active }) =>
    active ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' : '#e5e7eb'};
  border: none;
  border-radius: 100px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    top: 4px;
    left: ${({ active }) => (active ? '28px' : '4px')};
    transition: left 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const PricingCard = styled.div`
  background: ${({ featured }) =>
    featured ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'white'};
  border: ${({ featured }) =>
    featured ? 'none' : '2px solid rgba(0, 0, 0, 0.06)'};
  border-radius: 24px;
  padding: 40px;
  position: relative;
  transition: all 0.3s;

  ${({ featured }) =>
    featured &&
    `
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.2);
  `}

  &:hover {
    transform: ${({ featured }) =>
      featured ? 'scale(1.05)' : 'translateY(-4px)'};
    box-shadow: ${({ featured }) =>
      featured
        ? '0 24px 48px rgba(236, 72, 153, 0.3)'
        : '0 12px 32px rgba(0, 0, 0, 0.08)'};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
`;

const PlanName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ featured }) => (featured ? 'white' : '#1f2937')};
  margin-bottom: 8px;
`;

const PlanDescription = styled.p`
  font-size: 14px;
  color: ${({ featured }) => (featured ? '#9ca3af' : '#6b7280')};
  margin-bottom: 24px;
`;

const Price = styled.div`
  margin-bottom: 24px;
`;

const PriceAmount = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: ${({ featured }) => (featured ? 'white' : '#1f2937')};
  line-height: 1;

  span {
    font-size: 20px;
    font-weight: 600;
    color: ${({ featured }) => (featured ? '#9ca3af' : '#6b7280')};
  }
`;

const PricePeriod = styled.div`
  font-size: 14px;
  color: ${({ featured }) => (featured ? '#9ca3af' : '#6b7280')};
  margin-top: 4px;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 32px;

  ${({ featured }) =>
    featured
      ? `
    background: white;
    color: #1f2937;
    border: none;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
    }
  `
      : `
    background: transparent;
    color: #1f2937;
    border: 2px solid #e5e7eb;
    &:hover {
      border-color: #ec4899;
      color: #ec4899;
    }
  `}
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${({ featured }) => (featured ? '#d1d5db' : '#6b7280')};

  svg {
    width: 20px;
    height: 20px;
    color: ${({ featured }) =>
      featured ? '#10b981' : ({ theme }) => theme.colors.tertiary};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out',
    price: 0,
    period: 'Forever free',
    cta: 'Get Started',
    features: [
      '10 images per day',
      'Basic compression',
      'WebP & JPEG formats',
      'Up to 5MB per file',
      'Standard processing speed',
    ],
  },
  {
    name: 'Pro',
    description: 'For professionals',
    price: 19,
    period: 'per month',
    cta: 'Start Free Trial',
    featured: true,
    features: [
      'Unlimited images',
      'Advanced AI compression',
      'All formats supported',
      'Up to 50MB per file',
      'Priority processing',
      'Batch processing (50 files)',
      'API access',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For teams & businesses',
    price: 99,
    period: 'per month',
    cta: 'Contact Sales',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom API limits',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'Volume discounts',
    ],
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <Section id="pricing">
      <Container>
        <Header>
          <Badge>
            <Zap size={16} />
            Pricing
          </Badge>
          <Title>Simple, transparent pricing</Title>
          <Subtitle>
            Choose the plan that fits your needs. All plans include a 14-day
            free trial.
          </Subtitle>

          <Toggle>
            <ToggleLabel active={!isAnnual}>Monthly</ToggleLabel>
            <ToggleSwitch
              active={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
            />
            <ToggleLabel active={isAnnual}>
              Annual <span style={{ color: '#10b981' }}>(Save 20%)</span>
            </ToggleLabel>
          </Toggle>
        </Header>

        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard key={index} featured={plan.featured}>
              {plan.featured && <PopularBadge>Most Popular</PopularBadge>}

              <PlanName featured={plan.featured}>{plan.name}</PlanName>
              <PlanDescription featured={plan.featured}>
                {plan.description}
              </PlanDescription>

              <Price>
                <PriceAmount featured={plan.featured}>
                  $
                  {isAnnual && plan.price > 0
                    ? plan.price * 12 * 0.8
                    : plan.price}
                  {plan.price > 0 && <span>/mo</span>}
                </PriceAmount>
                <PricePeriod featured={plan.featured}>
                  {isAnnual && plan.price > 0 ? 'Billed annually' : plan.period}
                </PricePeriod>
              </Price>

              <CTAButton featured={plan.featured}>{plan.cta}</CTAButton>

              <FeatureList>
                {plan.features.map((feature, idx) => (
                  <Feature key={idx} featured={plan.featured}>
                    <Check />
                    <span>{feature}</span>
                  </Feature>
                ))}
              </FeatureList>
            </PricingCard>
          ))}
        </PricingGrid>
      </Container>
    </Section>
  );
};

export default Pricing;
