import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Receipt, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';

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

const Table = styled.div`
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 2px solid #f3f4f6;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr;
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
`;

const TableCell = styled.div`
  font-size: 14px;
  color: #1f2937;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &::before {
      content: '${({ label }) => label}:';
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'succeeded'
      ? 'rgba(16, 185, 129, 0.1)'
      : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ status }) => (status === 'succeeded' ? '#10b981' : '#ef4444')};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const EmptyTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const BillingHistorySection = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setPayments([]);
      setLoading(false);
      return;
    }

    const paymentsRef = ref(
      database,
      `users/${currentUser.uid}/paymentHistory`,
    );
    const unsubscribe = onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const paymentsArray = Object.entries(data)
          .map(([id, payment]) => ({
            id,
            ...payment,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        setPayments(paymentsArray);
      } else {
        setPayments([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPlanName = (planId) => {
    const planNames = {
      free: 'Free',
      payAsYouGo: 'Pay As You Go',
      plus: 'Plus',
      pro: 'Pro',
    };
    return planNames[planId] || planId;
  };

  if (loading) {
    return <div>Loading billing history...</div>;
  }

  return (
    <Section>
      <Card>
        <CardTitle>Billing History</CardTitle>

        {payments.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Receipt />
            </EmptyIcon>
            <EmptyTitle>No payment history</EmptyTitle>
            <EmptyText>
              Your payment history will appear here once you make a purchase.
            </EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <div>Date</div>
              <div>Plan</div>
              <div>Amount</div>
              <div>Status</div>
            </TableHeader>

            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell label="Date">
                  {formatDate(payment.timestamp)}
                </TableCell>
                <TableCell label="Plan">
                  {getPlanName(payment.planId)}
                </TableCell>
                <TableCell label="Amount">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell label="Status">
                  <StatusBadge status={payment.status}>
                    {payment.status === 'succeeded' ? (
                      <CheckCircle2 />
                    ) : (
                      <XCircle />
                    )}
                    {payment.status === 'succeeded' ? 'Succeeded' : 'Failed'}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>
    </Section>
  );
};

export default BillingHistorySection;
