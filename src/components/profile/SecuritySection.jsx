import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Key, Check, X, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

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
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`;

const PasswordHint = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    color: #374151;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #059669;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
`;

const OAuthInfo = styled.div`
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border: 2px solid #93c5fd;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    color: #3b82f6;
    flex-shrink: 0;
  }
`;

const OAuthText = styled.div`
  font-size: 14px;
  color: #1e40af;
  line-height: 1.6;
`;

const SecuritySection = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isEmailUser = currentUser?.providerData?.some(
    (provider) => provider.providerId === 'password',
  );

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);

      setSuccess('Password updated successfully!');
      addToast('Password changed successfully', 'success');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsEditing(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error updating password:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later');
      } else {
        setError('Failed to update password. Please try again.');
      }

      // Capture authentication error in Sentry
      if (window.Sentry) {
        window.Sentry.captureException(err, {
          tags: {
            authMethod: 'email',
            errorCode: err.code || 'unknown',
            operation: 'password_change',
          },
          extra: {
            errorMessage: err.message,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section>
      <Card>
        <CardTitle>Password & Security</CardTitle>

        {!isEmailUser ? (
          <OAuthInfo>
            <Shield size={24} />
            <OAuthText>
              You&apos;re signed in with Google. Password management is handled
              through your Google account. Visit your Google Account settings to
              change your password.
            </OAuthText>
          </OAuthInfo>
        ) : (
          <>
            {!isEditing ? (
              <div>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  Keep your account secure by using a strong, unique password.
                </p>
                <SaveButton onClick={() => setIsEditing(true)}>
                  <Key />
                  Change Password
                </SaveButton>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <PasswordHint>Must be at least 6 characters</PasswordHint>
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </InputGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <ButtonGroup>
                  <CancelButton
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X />
                    Cancel
                  </CancelButton>
                  <SaveButton type="submit" disabled={isLoading}>
                    <Check />
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </SaveButton>
                </ButtonGroup>
              </Form>
            )}
          </>
        )}
      </Card>
    </Section>
  );
};

export default SecuritySection;
