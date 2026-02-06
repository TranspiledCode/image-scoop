import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import { usePricing } from '../../hooks/usePricing';
import { useAuth } from '../../context/AuthContext';
import { useUserSubscription } from '../../hooks/useUserSubscription';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';

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
  background: rgba(236, 72, 153, 0.15);
  color: #d91d5a;
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
  color: ${({ active }) => (active ? '#1f2937' : '#6b7280')};
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
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
    gap: 32px;
  }
`;

const PricingCard = styled.div`
  background: ${({ featured }) =>
    featured ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'white'};
  border: ${({ featured }) =>
    featured ? 'none' : '2px solid rgba(0, 0, 0, 0.06)'};
  border-radius: 20px;
  padding: 32px 24px;
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

  @media (max-width: 768px) {
    padding: 32px 24px;
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
  font-size: 18px;
  font-weight: 700;
  color: ${({ featured }) => (featured ? 'white' : '#1f2937')};
  margin-bottom: 6px;
`;

const PlanDescription = styled.p`
  font-size: 13px;
  color: ${({ featured }) => (featured ? '#9ca3af' : '#6b7280')};
  margin-bottom: 20px;
  line-height: 1.4;
`;

const Price = styled.div`
  margin-bottom: 20px;
`;

const PriceAmount = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: ${({ featured }) => (featured ? 'white' : '#1f2937')};
  line-height: 1;

  span {
    font-size: 18px;
    font-weight: 600;
    color: ${({ featured }) => (featured ? '#9ca3af' : '#6b7280')};
  }
`;

const PricePeriod = styled.div`
  font-size: 13px;
  color: ${({ featured }) => (featured ? '#9ca3af' : '#6b7280')};
  margin-top: 4px;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;

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
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
  color: ${({ featured }) => (featured ? '#d1d5db' : '#6b7280')};
  line-height: 1.4;

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${({ featured }) =>
      featured ? '#10b981' : ({ theme }) => theme.colors.tertiary};
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const plans = [
  {
    name: 'Free',
    description: 'Perfect for personal use',
    price: 0,
    period: 'Forever free',
    cta: 'Get Started',
    features: [
      '20 images per day (~600/month)',
      '4 variants (s, m, l, xl)',
      'WebP, JPEG, PNG formats',
      'Up to 10MB per file',
      'Single image processing',
    ],
  },
  {
    name: 'Pay As You Go',
    description: 'Buy scoops when you need them',
    price: 5,
    period: 'Starting at',
    cta: 'Buy Scoops',
    payAsYouGo: true,
    features: [
      '100 scoops for $5 (5¢ each)',
      '250 scoops for $10 (4¢ each)',
      '600 scoops for $20 (3.3¢ each)',
      'Scoops never expire',
      '6 variants (xs, s, m, l, xl, xxl)',
      'WebP, JPEG, PNG, AVIF formats',
      'Up to 20MB per file',
      'Single image processing',
    ],
  },
  {
    name: 'Plus',
    description: 'For creators & small businesses',
    price: 5,
    period: 'per month',
    cta: 'Subscribe',
    featured: true,
    features: [
      '100 images per day (~3,000/month)',
      '6 variants (xs, s, m, l, xl, xxl)',
      'WebP, JPEG, PNG, AVIF formats',
      'Up to 20MB per file',
      'Batch processing (10 files)',
      '7-day history & re-download',
    ],
  },
  {
    name: 'Pro',
    description: 'For professionals & developers',
    price: 10,
    period: 'per month',
    cta: 'Subscribe',
    features: [
      'Unlimited images',
      'All variants + App icons',
      'All formats + advanced options',
      'Up to 50MB per file',
      'Batch processing (25 files)',
      'API access (coming soon)',
      '30-day history & re-download',
      'Priority email support',
    ],
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState({});
  const { pricing, loading, error } = usePricing();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { subscription } = useUserSubscription();

  // Load payment history for trial detection
  useEffect(() => {
    if (currentUser) {
      const paymentHistoryRef = ref(database, `users/${currentUser.uid}/paymentHistory`);
      const unsubscribe = onValue(paymentHistoryRef, (snapshot) => {
        setPaymentHistory(snapshot.val() || {});
      });
      return unsubscribe;
    }
  }, [currentUser]);

  // Use fallback plans if pricing data is not loaded yet
  const plansToDisplay = pricing?.plans || plans;
  const annualDiscount = pricing?.metadata?.annualDiscount || 0.2;

  // Helper function to detect if user has previously used a trial
  const hasUserUsedTrial = (subscription, paymentHistory) => {
    // Currently in trial
    if (subscription?.status === 'trialing') return true;
    
    // Previously on paid plan (inferred from payment history)
    if (paymentHistory && Object.keys(paymentHistory).length > 0) {
      const hasPaidPayments = Object.values(paymentHistory).some(
        payment => ['plus', 'pro', 'payAsYouGo'].includes(payment.planId)
      );
      if (hasPaidPayments) return true;
    }
    
    // Previously had trial (inferred from current paid status)
    if (['plus', 'pro'].includes(subscription?.planId) && 
        subscription?.status === 'active') {
      return true;
    }
    
    // PAYG users who have purchased scoops are considered paid users
    if (subscription?.planId === 'payAsYouGo' && 
        subscription?.payAsYouGoBalance > 0) {
      return true;
    }
    
    return false;
  };

  // Helper function to get appropriate button text
  const getButtonText = (plan) => {
    const currentPlanId = subscription?.planId || 'free';
    
    if (plan.name.toLowerCase() === currentPlanId) {
      if (plan.name.toLowerCase() === 'pay as you go') {
        return 'Buy More Scoops';
      }
      return 'Current Plan';
    }

    // Special handling for PAYG users trying to downgrade to free plan
    if (plan.name === 'Free' && subscription?.planId === 'payAsYouGo' && subscription?.payAsYouGoBalance > 0) {
      const scoopCount = subscription.payAsYouGoBalance;
      return `Use ${scoopCount} Scoop${scoopCount === 1 ? '' : 's'} First`;
    }

    // Handle trial-eligible plans (Plus and Pro)
    if (['Plus', 'Pro'].includes(plan.name)) {
      const hasUsedTrial = hasUserUsedTrial(subscription, paymentHistory);
      
      if (hasUsedTrial) {
        return 'Subscribe';
      } else {
        return 'Start Free Trial';
      }
    }

    return plan.cta;
  };

  const handlePlanCTAClick = (plan) => {
    if (currentUser) {
      // Prevent PAYG users with scoops from downgrading to free plan
      if (plan.name === 'Free' && subscription?.planId === 'payAsYouGo' && subscription?.payAsYouGoBalance > 0) {
        // Navigate to plan selection with context to show the proper message
        navigate('/plan-selection?context=downgrade&from=payAsYouGo');
        return;
      }

      if (plan.payAsYouGo) {
        navigate('/checkout?plan=payAsYouGo');
      } else if (plan.name === 'Free') {
        navigate('/process');
      } else {
        const planId = plan.name.toLowerCase();
        const billing = isAnnual ? 'annual' : 'monthly';
        navigate(`/checkout?plan=${planId}&billing=${billing}`);
      }
    } else {
      if (plan.payAsYouGo) {
        navigate('/signup?plan=payAsYouGo');
      } else {
        const planId = plan.name.toLowerCase();
        const billing = isAnnual ? 'annual' : 'monthly';
        navigate(`/signup?plan=${planId}&billing=${billing}`);
      }
    }
  };

  if (loading) {
    return (
      <Section id="pricing">
        <Container>
          <Header>
            <Badge>
              <Zap size={16} />
              Pricing
            </Badge>
            <Title>Simple, transparent pricing</Title>
            <Subtitle>Loading pricing information...</Subtitle>
          </Header>
        </Container>
      </Section>
    );
  }

  if (error) {
    console.error('Pricing error:', error);
    // Continue with fallback data
  }

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
              aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
              aria-pressed={isAnnual}
            />
            <ToggleLabel active={isAnnual}>
              Annual{' '}
              <span style={{ color: '#059669' }}>
                (Save {annualDiscount * 100}%)
              </span>
            </ToggleLabel>
          </Toggle>
        </Header>

        <PricingGrid>
          {plansToDisplay.map((plan, index) => (
            <PricingCard key={index} featured={plan.featured}>
              {plan.featured && <PopularBadge>Most Popular</PopularBadge>}

              <PlanName featured={plan.featured}>{plan.name}</PlanName>
              <PlanDescription featured={plan.featured}>
                {plan.description}
              </PlanDescription>

              <Price>
                <PriceAmount featured={plan.featured}>
                  $
                  {plan.payAsYouGo
                    ? plan.price
                    : isAnnual && plan.price > 0
                      ? plan.price * 12 * (1 - annualDiscount)
                      : plan.price}
                </PriceAmount>
                <PricePeriod featured={plan.featured}>
                  {plan.payAsYouGo
                    ? plan.period
                    : isAnnual && plan.price > 0
                      ? `per year ($${plan.price * (1 - annualDiscount)}/mo)`
                      : plan.period}
                </PricePeriod>
              </Price>

              <CTAButton
                featured={plan.featured}
                onClick={() => handlePlanCTAClick(plan)}
              >
                {getButtonText(plan)}
              </CTAButton>

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
