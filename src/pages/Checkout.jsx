import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle2, ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useUserSubscription } from '../hooks/useUserSubscription';
import { ref, set, runTransaction } from 'firebase/database';
import { database } from '../config/firebase';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fef3f3 0%, #fdf4e3 50%, #f0fdf4 100%);
  padding: 100px 48px;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0 0 32px 0;
  font-size: 15px;
`;

const InfoBanner = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #1e40af;

  svg {
    flex-shrink: 0;
    color: #3b82f6;
  }
`;

const UpgradeBanner = styled.div`
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.1) 0%,
    rgba(251, 146, 60, 0.1) 100%
  );
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #be185d;

  svg {
    flex-shrink: 0;
    color: #ec4899;
  }

  strong {
    font-weight: 700;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TestCardButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const TestCardButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OrderSummary = styled(Card)`
  height: fit-content;
`;

const SummaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #6b7280;

  &:last-child {
    border-bottom: none;
    margin-top: 12px;
    padding-top: 16px;
    border-top: 2px solid #e5e7eb;
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
  }
`;

const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
  color: #6b7280;

  svg {
    width: 16px;
    height: 16px;
    color: #10b981;
    flex-shrink: 0;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const VALID_PLANS = ['plus', 'pro', 'payAsYouGo'];
const VALID_BILLING = ['monthly', 'annual'];

const PAYG_PACKS = [
  { scoops: 100, price: 5, pricePerScoop: 0.05 },
  { scoops: 250, price: 10, pricePerScoop: 0.04 },
  { scoops: 600, price: 20, pricePerScoop: 0.033 },
];

const PLAN_DETAILS = {
  plus: {
    name: 'Plus',
    features: [
      '14-day free trial',
      '100 images per day (~3,000/month)',
      '6 variants (xs, s, m, l, xl, xxl)',
      'WebP, JPEG, PNG, AVIF formats',
      'Batch processing (10 files)',
      '7-day history & re-download',
    ],
  },
  pro: {
    name: 'Pro',
    features: [
      '14-day free trial',
      'Unlimited images',
      'All variants + App icons',
      'All formats + advanced options',
      'Batch processing (25 files)',
      '30-day history & re-download',
      'Priority email support',
    ],
  },
  payAsYouGo: {
    name: 'Pay As You Go',
    features: [
      'Scoops never expire',
      '6 variants (xs, s, m, l, xl, xxl)',
      'WebP, JPEG, PNG, AVIF formats',
      'Up to 20MB per file',
      'Single image processing',
    ],
  },
};

const PLAN_PRICES = {
  plus: { monthly: 5, annual: 48 },
  pro: { monthly: 10, annual: 96 },
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, createUserSubscription } = useAuth();
  const { addToast } = useToast();
  const { subscription, upgradeSubscription } = useUserSubscription();

  const [planParam, setPlanParam] = useState(null);
  const [billingParam, setBillingParam] = useState('monthly');
  const [contextParam, setContextParam] = useState(null);
  const [fromPlanParam, setFromPlanParam] = useState(null);
  const [selectedPack, setSelectedPack] = useState(PAYG_PACKS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/signup');
      return;
    }

    const plan = searchParams.get('plan');
    const billing = searchParams.get('billing') || 'monthly';
    const context = searchParams.get('context'); // 'upgrade', 'reactivate', 'trial-convert'
    const fromPlan = searchParams.get('from');

    if (!plan || !VALID_PLANS.includes(plan)) {
      addToast('Invalid plan selected', 'error');
      navigate('/plan-selection');
      return;
    }

    if (!VALID_BILLING.includes(billing)) {
      setBillingParam('monthly');
    } else {
      setBillingParam(billing);
    }

    setPlanParam(plan);
    setContextParam(context);
    setFromPlanParam(fromPlan);
  }, [searchParams, currentUser, navigate, addToast]);

  const useTestCard = (type) => {
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
    } else {
      setCardNumber('5555 5555 5555 4444');
    }
    setExpiry('12/25');
    setCvc('123');
  };

  const handleMockPayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!cardNumber || !expiry || !cvc) {
      setError('Please fill in all payment fields');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 500),
      );

      const success = Math.random() > 0.05;

      if (!success) {
        setError('Payment failed. Please try again with a different card.');
        setIsLoading(false);
        return;
      }

      const price =
        planParam === 'payAsYouGo'
          ? selectedPack.price
          : PLAN_PRICES[planParam][billingParam];

      const paymentId = `mock_payment_${Date.now()}`;
      await set(
        ref(database, `users/${currentUser.uid}/paymentHistory/${paymentId}`),
        {
          amount: price,
          planId: planParam,
          timestamp: Date.now(),
          mockPaymentMethod: cardNumber.startsWith('4242')
            ? 'mock_card_visa'
            : 'mock_card_mastercard',
          status: 'succeeded',
        },
      );

      if (planParam === 'payAsYouGo') {
        const isExistingUser = subscription?.planId !== undefined;

        if (isExistingUser) {
          // Existing user buying scoops - just add to balance, don't change plan
          const balanceRef = ref(
            database,
            `users/${currentUser.uid}/subscription/payAsYouGoBalance`,
          );
          await runTransaction(balanceRef, (currentBalance) => {
            const current = currentBalance || 0;
            return current + selectedPack.scoops;
          });

          addToast(
            `Successfully added ${selectedPack.scoops} backup scoops!`,
            'success',
          );
        } else {
          // New user signing up with PAYG
          await createUserSubscription(currentUser.uid, 'payAsYouGo', null);
          await set(
            ref(
              database,
              `users/${currentUser.uid}/subscription/payAsYouGoBalance`,
            ),
            selectedPack.scoops,
          );
          addToast(
            `Successfully purchased ${selectedPack.scoops} scoops!`,
            'success',
          );
        }
      } else {
        const isUpgrade = contextParam === 'upgrade';
        const planName = PLAN_DETAILS[planParam].name;

        if (isUpgrade) {
          // Always preserve scoop balance (backup scoops for Free/Plus users)
          const balanceToPreserve = subscription?.payAsYouGoBalance || 0;

          // Preserve trial if currently in trial
          const isInTrial =
            subscription?.status === 'trialing' &&
            subscription?.trialEndDate > Date.now();
          const upgradeData = {
            planId: planParam,
            planName: planName,
            billingCycle: billingParam,
            payAsYouGoBalance: balanceToPreserve,
          };

          if (isInTrial) {
            // Keep trial status and dates
            upgradeData.status = 'trialing';
            upgradeData.trialEndDate = subscription.trialEndDate;
            upgradeData.currentPeriodEnd = subscription.currentPeriodEnd;
          } else {
            // New period for non-trial upgrades
            upgradeData.currentPeriodEnd =
              Date.now() + 30 * 24 * 60 * 60 * 1000;
          }

          await upgradeSubscription(upgradeData);

          // Reset daily usage counter to give full benefit of new plan
          const usageRef = ref(database, `users/${currentUser.uid}/usage`);
          await runTransaction(usageRef, (current) => {
            if (!current) return current;
            return {
              ...current,
              imagesProcessedToday: 0, // Reset to 0 on upgrade
            };
          });

          addToast(`Successfully upgraded to ${planName}!`, 'success');
        } else {
          await createUserSubscription(
            currentUser.uid,
            planParam,
            billingParam,
          );
          addToast(
            `Welcome to ${planName}! Your 14-day trial has started.`,
            'success',
          );
        }
      }

      // Navigate based on context
      if (contextParam === 'upgrade' || planParam === 'payAsYouGo') {
        // Upgrades and scoop purchases go to profile subscription section
        navigate('/profile#subscription');
      } else {
        // New signups go to process page
        navigate('/process');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);

      // Capture payment error in Sentry
      if (window.Sentry) {
        window.Sentry.captureException(err, {
          tags: {
            operation: 'payment_processing',
            planId: planParam,
            billingCycle: billingParam,
            context: contextParam,
          },
          extra: {
            errorMessage: err.message,
            fromPlan: fromPlanParam,
          },
        });
      }
    }
  };

  if (!planParam) {
    return null;
  }

  const planDetails = PLAN_DETAILS[planParam];
  const price =
    planParam === 'payAsYouGo'
      ? selectedPack.price
      : PLAN_PRICES[planParam][billingParam];

  return (
    <PageContainer>
      <Container>
        <Grid>
          <Card>
            <Title>Complete your purchase</Title>
            <Subtitle>Enter your payment details below</Subtitle>

            <InfoBanner>
              <Lock size={20} />
              <div>
                <strong>Test mode:</strong> This is a simulated checkout. No
                real charges will be made.
              </div>
            </InfoBanner>

            {contextParam === 'upgrade' && fromPlanParam && (
              <UpgradeBanner>
                <ArrowUp size={20} />
                <div>
                  <strong>Upgrading:</strong>{' '}
                  {fromPlanParam.charAt(0).toUpperCase() +
                    fromPlanParam.slice(1)}{' '}
                  → {planDetails.name}
                </div>
              </UpgradeBanner>
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {planParam === 'payAsYouGo' && (
              <InputGroup>
                <Label>Select Pack</Label>
                {PAYG_PACKS.map((pack) => (
                  <TestCardButton
                    key={pack.scoops}
                    onClick={() => setSelectedPack(pack)}
                    style={{
                      background:
                        selectedPack.scoops === pack.scoops
                          ? '#ec4899'
                          : '#f3f4f6',
                      color:
                        selectedPack.scoops === pack.scoops
                          ? 'white'
                          : '#374151',
                    }}
                  >
                    {pack.scoops} scoops - ${pack.price} (
                    {(pack.pricePerScoop * 100).toFixed(1)}¢ each)
                  </TestCardButton>
                ))}
              </InputGroup>
            )}

            <Form onSubmit={handleMockPayment}>
              <InputGroup>
                <Label>Card Number</Label>
                <TestCardButtons>
                  <TestCardButton
                    type="button"
                    onClick={() => useTestCard('visa')}
                  >
                    Use Test Visa
                  </TestCardButton>
                  <TestCardButton
                    type="button"
                    onClick={() => useTestCard('mastercard')}
                  >
                    Use Test Mastercard
                  </TestCardButton>
                </TestCardButtons>
                <Input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
              </InputGroup>

              <CardRow>
                <InputGroup>
                  <Label>Expiry Date</Label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                  />
                </InputGroup>

                <InputGroup>
                  <Label>CVC</Label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    maxLength={3}
                  />
                </InputGroup>
              </CardRow>

              <SubmitButton type="submit" disabled={isLoading}>
                <CreditCard size={20} />
                {isLoading ? 'Processing...' : `Pay $${price}`}
              </SubmitButton>
            </Form>
          </Card>

          <OrderSummary>
            <SummaryTitle>Order Summary</SummaryTitle>

            <PlanBadge>{planDetails.name}</PlanBadge>

            <SummaryRow>
              <span>Plan</span>
              <strong>{planDetails.name}</strong>
            </SummaryRow>

            {planParam !== 'payAsYouGo' && (
              <SummaryRow>
                <span>Billing</span>
                <strong>
                  {billingParam === 'monthly' ? 'Monthly' : 'Annual'}
                </strong>
              </SummaryRow>
            )}

            {planParam === 'payAsYouGo' && (
              <SummaryRow>
                <span>Scoops</span>
                <strong>{selectedPack.scoops}</strong>
              </SummaryRow>
            )}

            <SummaryRow>
              <span>Total</span>
              <strong>${price}</strong>
            </SummaryRow>

            <FeaturesList>
              {planDetails.features.map((feature, idx) => (
                <Feature key={idx}>
                  <CheckCircle2 />
                  <span>{feature}</span>
                </Feature>
              ))}
            </FeaturesList>
          </OrderSummary>
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default Checkout;
