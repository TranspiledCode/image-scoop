import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Zap,
  Calendar,
  AlertCircle,
  ArrowUpCircle,
  XCircle,
  ShoppingCart,
} from 'lucide-react';
import { useUserSubscription } from '../../hooks/useUserSubscription';
import { useToast } from '../../context/ToastContext';
import { ref, set } from 'firebase/database';
import { database } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: #f9fafb;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fdf2f8 0%, #fff7ed 100%);
  border-radius: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const PlanInfo = styled.div``;

const PlanName = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
`;

const PlanStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'active'
      ? 'rgba(16, 185, 129, 0.1)'
      : status === 'trialing'
        ? 'rgba(59, 130, 246, 0.1)'
        : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ status }) =>
    status === 'active'
      ? '#10b981'
      : status === 'trialing'
        ? '#3b82f6'
        : '#ef4444'};
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`;

const PlanDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DetailIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ background }) => background};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DetailContent = styled.div`
  min-width: 0;
`;

const DetailLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
`;

const TrialBanner = styled.div`
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border: 2px solid #93c5fd;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  svg {
    color: #3b82f6;
    flex-shrink: 0;
  }
`;

const TrialText = styled.div`
  flex: 1;
  font-size: 14px;
  color: #1e40af;
  line-height: 1.5;

  strong {
    font-weight: 700;
  }
`;

const ScheduledChangeBanner = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  svg {
    color: #d97706;
    flex-shrink: 0;
  }
`;

const ScheduledChangeText = styled.div`
  flex: 1;
  font-size: 14px;
  color: #92400e;
  line-height: 1.5;

  strong {
    font-weight: 700;
  }
`;

const CanceledBanner = styled.div`
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  svg {
    color: #dc2626;
    flex-shrink: 0;
  }
`;

const CanceledText = styled.div`
  flex: 1;
  font-size: 14px;
  color: #991b1b;
  line-height: 1.5;

  strong {
    font-weight: 700;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
    }
  `
      : variant === 'danger'
        ? `
    background: transparent;
    color: #ef4444;
    border: 2px solid #fca5a5;
    &:hover {
      background: #fef2f2;
      border-color: #ef4444;
    }
  `
        : `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    &:hover {
      border-color: #ec4899;
      color: #ec4899;
    }
  `}

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
`;

const ModalText = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const SubscriptionSection = () => {
  const { subscription, loading } = useUserSubscription();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  if (loading) {
    return <div>Loading subscription...</div>;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const days = Math.ceil((endDate - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const handleUpgradePlan = () => {
    const currentPlan = subscription?.planId || 'free';
    navigate(`/plan-selection?context=upgrade&from=${currentPlan}`);
  };

  const handleChangePlan = () => {
    const currentPlan = subscription?.planId;
    navigate(`/plan-selection?context=downgrade&from=${currentPlan}`);
  };

  const handleBuyScoops = () => {
    navigate('/checkout?plan=payAsYouGo');
  };

  const handleCancelScheduledChange = async () => {
    try {
      await set(
        ref(
          database,
          `users/${currentUser.uid}/subscription/scheduledDowngrade`,
        ),
        null,
      );
      addToast('Scheduled plan change canceled', 'success');
    } catch (error) {
      console.error('Error canceling scheduled change:', error);
      addToast('Failed to cancel scheduled change', 'error');
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);

    try {
      await set(
        ref(database, `users/${currentUser.uid}/subscription/status`),
        'canceled',
      );

      addToast(
        'Subscription canceled. Access continues until period end.',
        'success',
      );
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      addToast('Failed to cancel subscription. Please try again.', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleReactivate = async () => {
    try {
      const newStatus =
        subscription?.trialEndDate && subscription.trialEndDate > Date.now()
          ? 'trialing'
          : 'active';
      await set(
        ref(database, `users/${currentUser.uid}/subscription/status`),
        newStatus,
      );
      addToast('Subscription reactivated!', 'success');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      addToast('Failed to reactivate subscription', 'error');
    }
  };

  const isFreePlan = subscription?.planId === 'free';
  const isPayAsYouGo = subscription?.planId === 'payAsYouGo';
  const isPlusPlan = subscription?.planId === 'plus';
  const isProPlan = subscription?.planId === 'pro';
  const isTrialing = subscription?.status === 'trialing';
  const isCanceled = subscription?.status === 'canceled';
  const hasScheduledDowngrade = !!subscription?.scheduledDowngrade;
  const trialDaysRemaining = getDaysRemaining(subscription?.trialEndDate);

  return (
    <Section>
      <Card>
        <CardTitle>Current Plan</CardTitle>

        <PlanHeader>
          <PlanInfo>
            <PlanName>{subscription?.planName || 'Free'} Plan</PlanName>
            <PlanStatus status={subscription?.status || 'active'}>
              <StatusDot />
              {subscription?.status === 'trialing'
                ? 'Trial Active'
                : subscription?.status === 'canceled'
                  ? 'Canceled'
                  : 'Active'}
            </PlanStatus>
          </PlanInfo>
        </PlanHeader>

        {isCanceled && subscription?.currentPeriodEnd && (
          <CanceledBanner>
            <XCircle size={20} />
            <CanceledText>
              <strong>Subscription Canceled.</strong> You still have access to{' '}
              {subscription?.planName} features until{' '}
              {formatDate(subscription?.currentPeriodEnd)}.
            </CanceledText>
          </CanceledBanner>
        )}

        {isTrialing && trialDaysRemaining > 0 && (
          <TrialBanner>
            <AlertCircle size={20} />
            <TrialText>
              <strong>{trialDaysRemaining} days remaining</strong> in your free
              trial. Your trial ends on {formatDate(subscription?.trialEndDate)}
              .
            </TrialText>
          </TrialBanner>
        )}

        {hasScheduledDowngrade && (
          <ScheduledChangeBanner>
            <AlertCircle size={20} />
            <ScheduledChangeText>
              <strong>Scheduled Plan Change:</strong> Your plan will change to{' '}
              {subscription.scheduledDowngrade.toPlanName} on{' '}
              {formatDate(subscription.scheduledDowngrade.effectiveDate)}.
            </ScheduledChangeText>
          </ScheduledChangeBanner>
        )}

        <PlanDetails>
          {subscription?.billingCycle && (
            <DetailItem>
              <DetailIcon background="rgba(16, 185, 129, 0.1)" color="#10b981">
                <CreditCard />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Billing</DetailLabel>
                <DetailValue>
                  {subscription.billingCycle === 'monthly'
                    ? 'Monthly'
                    : 'Annual'}
                </DetailValue>
              </DetailContent>
            </DetailItem>
          )}

          {subscription?.currentPeriodEnd && !isCanceled && (
            <DetailItem>
              <DetailIcon background="rgba(59, 130, 246, 0.1)" color="#3b82f6">
                <Calendar />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>
                  {isTrialing ? 'Trial Ends' : 'Renews On'}
                </DetailLabel>
                <DetailValue>
                  {formatDate(subscription.currentPeriodEnd)}
                </DetailValue>
              </DetailContent>
            </DetailItem>
          )}

          {(subscription?.payAsYouGoBalance || 0) > 0 && (
            <DetailItem>
              <DetailIcon background="rgba(236, 72, 153, 0.1)" color="#ec4899">
                <Zap />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>
                  {isPayAsYouGo ? 'Scoop Balance' : 'Backup Scoop Balance'}
                </DetailLabel>
                <DetailValue>
                  {subscription?.payAsYouGoBalance || 0} scoops
                </DetailValue>
              </DetailContent>
            </DetailItem>
          )}
        </PlanDetails>

        <Actions>
          {isFreePlan && (
            <>
              <ActionButton variant="primary" onClick={handleUpgradePlan}>
                <ArrowUpCircle />
                Upgrade Plan
              </ActionButton>
              <ActionButton variant="secondary" onClick={handleBuyScoops}>
                <ShoppingCart />
                Buy Scoops (PAYG)
              </ActionButton>
            </>
          )}

          {isPayAsYouGo && (
            <>
              <ActionButton variant="primary" onClick={handleBuyScoops}>
                <ShoppingCart />
                Buy More Scoops
              </ActionButton>
              <ActionButton variant="secondary" onClick={handleUpgradePlan}>
                <ArrowUpCircle />
                Upgrade to Plus/Pro
              </ActionButton>
            </>
          )}

          {isPlusPlan && !isCanceled && (
            <>
              {!hasScheduledDowngrade && (
                <>
                  <ActionButton
                    variant="primary"
                    onClick={() =>
                      navigate(
                        '/checkout?plan=pro&billing=monthly&context=upgrade&from=plus',
                      )
                    }
                  >
                    <ArrowUpCircle />
                    Upgrade to Pro
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={handleChangePlan}>
                    Change Plan
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={handleBuyScoops}>
                    <ShoppingCart />
                    Buy Backup Scoops
                  </ActionButton>
                </>
              )}
              {hasScheduledDowngrade && (
                <ActionButton
                  variant="secondary"
                  onClick={handleCancelScheduledChange}
                >
                  <XCircle />
                  Cancel Scheduled Change
                </ActionButton>
              )}
              <ActionButton
                variant="danger"
                onClick={() => setShowCancelModal(true)}
              >
                <XCircle />
                Cancel Subscription
              </ActionButton>
            </>
          )}

          {isProPlan && !isCanceled && (
            <>
              {!hasScheduledDowngrade && (
                <ActionButton variant="secondary" onClick={handleChangePlan}>
                  Change Plan
                </ActionButton>
              )}
              {hasScheduledDowngrade && (
                <ActionButton
                  variant="secondary"
                  onClick={handleCancelScheduledChange}
                >
                  <XCircle />
                  Cancel Scheduled Change
                </ActionButton>
              )}
              <ActionButton
                variant="danger"
                onClick={() => setShowCancelModal(true)}
              >
                <XCircle />
                Cancel Subscription
              </ActionButton>
            </>
          )}

          {isCanceled && subscription?.currentPeriodEnd > Date.now() && (
            <ActionButton variant="primary" onClick={handleReactivate}>
              <ArrowUpCircle />
              Reactivate Subscription
            </ActionButton>
          )}
        </Actions>
      </Card>

      {showCancelModal && (
        <Modal onClick={() => !isCanceling && setShowCancelModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Cancel Subscription?</ModalTitle>
            <ModalText>
              Are you sure you want to cancel your subscription? You&apos;ll
              continue to have access to {subscription?.planName} features until{' '}
              {formatDate(subscription?.currentPeriodEnd)}.
            </ModalText>
            <ModalActions>
              <ActionButton
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
                disabled={isCanceling}
              >
                Keep Plan
              </ActionButton>
              <ActionButton
                variant="danger"
                onClick={handleCancelSubscription}
                disabled={isCanceling}
              >
                <XCircle />
                {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </Section>
  );
};

export default SubscriptionSection;
