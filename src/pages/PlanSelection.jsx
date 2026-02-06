import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useUserSubscription } from '../hooks/useUserSubscription';
import DowngradeConfirmationModal from '../components/profile/DowngradeConfirmationModal';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fef3f3 0%, #fdf4e3 50%, #f0fdf4 100%);
  padding: 100px 48px;
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
  margin: 0 auto;
  line-height: 1.6;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
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

const CurrentPlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
    color: ${({ featured }) => (featured ? '#10b981' : '#10b981')};
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const plans = [
  {
    id: 'free',
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
    id: 'payAsYouGo',
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
    id: 'plus',
    name: 'Plus',
    description: 'For creators & small businesses',
    price: 5,
    period: 'per month',
    cta: 'Subscribe',
    featured: true,
    features: [
      '14-day free trial',
      '100 images per day (~3,000/month)',
      '6 variants (xs, s, m, l, xl, xxl)',
      'WebP, JPEG, PNG, AVIF formats',
      'Up to 20MB per file',
      'Batch processing (10 files)',
      '7-day history & re-download',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals & developers',
    price: 10,
    period: 'per month',
    cta: 'Subscribe',
    features: [
      '14-day free trial',
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

const PlanSelection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [selectedDowngrade, setSelectedDowngrade] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { createUserSubscription, currentUser } = useAuth();
  const { addToast } = useToast();
  const { subscription, scheduleDowngrade } = useUserSubscription();

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

  const searchParams = new URLSearchParams(location.search);
  const context = searchParams.get('context'); // 'upgrade' or 'downgrade'
  const fromPlan = searchParams.get('from'); // 'free', 'plus', 'pro', 'payAsYouGo'

  const currentPlanId = subscription?.planId || fromPlan || 'free';

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

  const getPlanOrder = (planId) => {
    const order = { free: 0, payAsYouGo: 0, plus: 1, pro: 2 };
    return order[planId] || 0;
  };

  const isUpgrade = (targetPlanId) => {
    return getPlanOrder(targetPlanId) > getPlanOrder(currentPlanId);
  };

  const isDowngrade = (targetPlanId) => {
    return getPlanOrder(targetPlanId) < getPlanOrder(currentPlanId);
  };

  const getButtonText = (plan) => {
    if (plan.id === currentPlanId) {
      // Allow PAYG users to buy more scoops
      if (plan.id === 'payAsYouGo') {
        return 'Buy More Scoops';
      }
      return 'Current Plan';
    }

    if (context === 'upgrade' && isUpgrade(plan.id)) {
      return 'Upgrade';
    }

    if (context === 'downgrade' && isDowngrade(plan.id)) {
      return 'Downgrade';
    }

    // Special handling for PAYG users trying to downgrade to free plan
    if (plan.id === 'free' && subscription?.planId === 'payAsYouGo' && subscription?.payAsYouGoBalance > 0) {
      const scoopCount = subscription.payAsYouGoBalance;
      return `Use ${scoopCount} Scoop${scoopCount === 1 ? '' : 's'} First`;
    }

    // Handle trial-eligible plans (Plus and Pro)
    if (['plus', 'pro'].includes(plan.id)) {
      const hasUsedTrial = hasUserUsedTrial(subscription, paymentHistory);
      
      if (hasUsedTrial) {
        return context === 'upgrade' ? 'Upgrade' : 'Subscribe';
      } else {
        return 'Start Free Trial';
      }
    }

    return plan.cta;
  };

  const handlePlanSelect = async (plan) => {
    if (!currentUser) {
      addToast('Please sign up first', 'error');
      navigate('/signup');
      return;
    }

    // Can't select current plan (unless PAYG - always allow buying more scoops)
    if (plan.id === currentPlanId && plan.id !== 'payAsYouGo') {
      return;
    }

    // Prevent PAYG users with scoops from downgrading to free plan
    if (plan.id === 'free' && subscription?.planId === 'payAsYouGo' && subscription?.payAsYouGoBalance > 0) {
      const scoopCount = subscription.payAsYouGoBalance;
      addToast(
        `You have ${scoopCount} scoop${scoopCount === 1 ? '' : 's'} remaining. You'll be downgraded to the free plan once your scoop${scoopCount === 1 ? '' : 's'} are used up.`,
        'info'
      );
      return;
    }

    // Handle downgrade
    if (context === 'downgrade' && isDowngrade(plan.id)) {
      setSelectedDowngrade(plan);
      setShowDowngradeModal(true);
      return;
    }

    // Handle upgrade or new signup
    setIsLoading(true);

    try {
      if (plan.id === 'free') {
        await createUserSubscription(currentUser.uid, 'free', null);
        addToast('Welcome to Image Scoop!', 'success');
        navigate('/process');
      } else if (plan.payAsYouGo) {
        // Pay-as-you-go always goes to checkout to select scoop pack
        navigate('/checkout?plan=payAsYouGo');
      } else {
        const upgradeParam =
          context === 'upgrade' ? `&context=upgrade&from=${currentPlanId}` : '';
        navigate(`/checkout?plan=${plan.id}&billing=monthly${upgradeParam}`);
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      addToast('Failed to select plan. Please try again.', 'error');

      // Capture subscription error in Sentry
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          tags: {
            operation: 'select_plan',
            planId: plan.id,
            context,
          },
          extra: {
            errorMessage: error.message,
            currentPlanId,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDowngrade = async () => {
    if (!selectedDowngrade || !subscription) return;

    setIsScheduling(true);

    try {
      const effectiveDate =
        subscription.currentPeriodEnd || Date.now() + 30 * 24 * 60 * 60 * 1000;

      await scheduleDowngrade(
        selectedDowngrade.id,
        selectedDowngrade.name,
        effectiveDate,
      );

      addToast(
        `Plan will change to ${selectedDowngrade.name} on ${new Date(effectiveDate).toLocaleDateString()}`,
        'success',
      );

      setShowDowngradeModal(false);
      navigate('/profile#subscription');
    } catch (error) {
      console.error('Error scheduling downgrade:', error);
      addToast('Failed to schedule downgrade. Please try again.', 'error');

      // Capture subscription error in Sentry
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          tags: {
            operation: 'schedule_downgrade',
            planId: selectedDowngrade?.id,
            currentPlanId: subscription?.planId,
          },
          extra: {
            errorMessage: error.message,
          },
        });
      }
    } finally {
      setIsScheduling(false);
    }
  };

  const getSubtitle = () => {
    if (context === 'upgrade') {
      return 'Choose a higher tier plan to unlock more features and capacity.';
    }
    if (context === 'downgrade') {
      return 'Select a lower tier plan. Your current plan will remain active until the end of the billing period.';
    }
    return 'Start with the Free plan or unlock more features with Plus or Pro. Paid plans include a 14-day free trial.';
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <Badge>
            <Zap size={16} />
            {context === 'upgrade'
              ? 'Upgrade Your Plan'
              : context === 'downgrade'
                ? 'Change Your Plan'
                : 'Choose Your Plan'}
          </Badge>
          <Title>Select the plan that fits your needs</Title>
          <Subtitle>{getSubtitle()}</Subtitle>
        </Header>

        <PricingGrid>
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;

            return (
              <PricingCard key={plan.id} featured={plan.featured && !isCurrent}>
                {isCurrent && <CurrentPlanBadge>Current Plan</CurrentPlanBadge>}
                {!isCurrent && plan.featured && !context && (
                  <PopularBadge>Most Popular</PopularBadge>
                )}

                <PlanName featured={plan.featured}>{plan.name}</PlanName>
                <PlanDescription featured={plan.featured}>
                  {plan.description}
                </PlanDescription>

                <Price>
                  <PriceAmount featured={plan.featured}>
                    ${plan.price}
                  </PriceAmount>
                  <PricePeriod featured={plan.featured}>
                    {plan.period}
                  </PricePeriod>
                </Price>

                <CTAButton
                  featured={plan.featured && !isCurrent}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isLoading || (isCurrent && plan.id !== 'payAsYouGo')}
                >
                  {isLoading ? 'Loading...' : getButtonText(plan)}
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
            );
          })}
        </PricingGrid>
      </Container>

      {selectedDowngrade && (
        <DowngradeConfirmationModal
          isOpen={showDowngradeModal}
          onClose={() => setShowDowngradeModal(false)}
          onConfirm={handleConfirmDowngrade}
          currentPlan={subscription?.planName || 'Current'}
          newPlan={selectedDowngrade.name}
          effectiveDate={
            subscription?.currentPeriodEnd ||
            Date.now() + 30 * 24 * 60 * 60 * 1000
          }
          isProcessing={isScheduling}
        />
      )}
    </PageContainer>
  );
};

export default PlanSelection;
