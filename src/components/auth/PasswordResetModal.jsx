import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AuthModal from './AuthModal';

const ModalContent = styled.div`
  padding: 2.5rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
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

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: inherit;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const PasswordResetModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
      addToast('Password reset email sent!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  const handleBackToLogin = () => {
    handleClose();
    onSwitchToLogin();
  };

  return (
    <AuthModal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <Title>Reset your password</Title>
        <Subtitle>
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || success}
              />
            </InputWrapper>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && (
            <SuccessMessage>
              Check your email for a password reset link. If you don&apos;t see
              it, check your spam folder.
            </SuccessMessage>
          )}

          <SubmitButton type="submit" disabled={isLoading || success}>
            <Send size={20} />
            {isLoading ? 'Sending...' : 'Send reset link'}
          </SubmitButton>

          <BackButton type="button" onClick={handleBackToLogin}>
            <ArrowLeft size={16} />
            Back to login
          </BackButton>
        </Form>
      </ModalContent>
    </AuthModal>
  );
};

PasswordResetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
};

export default PasswordResetModal;
