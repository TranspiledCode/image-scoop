import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Defer Sentry initialization until after page load to improve initial performance
const SENTRY_DSN =
  process.env.REACT_APP_SENTRY_DSN ||
  'https://836ef0c8872d0abfc75188d0fb481f47@o4509055999541248.ingest.us.sentry.io/4510621343875072';

if (SENTRY_DSN && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      import('@sentry/react').then((Sentry) => {
        Sentry.init({
          dsn: SENTRY_DSN,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
              maskAllText: false,
              blockAllMedia: false,
            }),
          ],
          tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
          replaysSessionSampleRate:
            process.env.NODE_ENV === 'production' ? 0.05 : 0.1,
          replaysOnErrorSampleRate: 1.0,
          environment: process.env.NODE_ENV || 'development',
        });
        // Expose Sentry globally for ErrorBoundary
        window.Sentry = Sentry;
      });
    }, 1500); // Delay Sentry by 1.5 seconds after load
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
