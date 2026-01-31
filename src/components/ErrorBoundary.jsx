import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const ErrorCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 3rem;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  color: #333;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 64px;
    height: 64px;
    color: #f59e0b;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Message = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #6b7280;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  cursor: pointer;

  summary {
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }

  pre {
    font-size: 0.875rem;
    color: #ef4444;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }
  `
      : `
    background: #f3f4f6;
    color: #4b5563;

    &:hover {
      background: #e5e7eb;
    }
  `}

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ErrorFallback = ({ error, resetError }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <ErrorContainer>
      <ErrorCard>
        <IconWrapper>
          <AlertTriangle />
        </IconWrapper>

        <Title>Oops! Something went wrong</Title>

        <Message>
          We are sorry for the inconvenience. The error has been reported and we
          will fix it as soon as possible.
        </Message>

        {process.env.NODE_ENV === 'development' && error && (
          <ErrorDetails>
            <summary>Error Details (Development Only)</summary>
            <pre>{error.message}</pre>
          </ErrorDetails>
        )}

        <ButtonGroup>
          <ActionButton variant="primary" onClick={resetError}>
            <RefreshCw />
            Try Again
          </ActionButton>
          <ActionButton onClick={handleGoHome}>
            <Home />
            Go Home
          </ActionButton>
        </ButtonGroup>
      </ErrorCard>
    </ErrorContainer>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetError: PropTypes.func.isRequired,
};

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.resetError = this.resetError.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Try to send to Sentry if it's loaded
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          errorBoundary: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  resetError() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}

AppErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppErrorBoundary;
