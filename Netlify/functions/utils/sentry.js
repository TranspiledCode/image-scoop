const Sentry = require('@sentry/node');

let initialized = false;

/**
 * Initialize Sentry for a Netlify function
 * @param {string} functionName - Name of the function for tagging
 */
function initSentry(functionName) {
  if (initialized) return;

  const dsn =
    process.env.SENTRY_DSN ||
    'https://836ef0c8872d0abfc75188d0fb481f47@o4509055999541248.ingest.us.sentry.io/4510621343875072';

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // Filter sensitive data from headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },
  });

  Sentry.setTag('function', functionName);
  initialized = true;
}

/**
 * Capture an error with additional context
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context (tags, extra)
 * @param {Object} context.tags - Custom tags for the error
 * @param {Object} context.extra - Extra data for debugging
 */
function captureError(error, context = {}) {
  Sentry.captureException(error, {
    tags: {
      ...context.tags,
      errorType: error.name,
    },
    extra: {
      ...context.extra,
      timestamp: Date.now(),
    },
  });
}

/**
 * Capture a message with context
 * @param {string} message - The message to capture
 * @param {string} level - Severity level (info, warning, error)
 * @param {Object} context - Additional context (tags, extra)
 */
function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, {
    level,
    tags: context.tags,
    extra: context.extra,
  });
}

/**
 * Add a breadcrumb for tracking user actions
 * @param {Object} breadcrumb - Breadcrumb data
 */
function addBreadcrumb(breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Set custom tag for all subsequent events
 * @param {string} key - Tag key
 * @param {string} value - Tag value
 */
function setTag(key, value) {
  Sentry.setTag(key, value);
}

/**
 * Flush Sentry events before function exits
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise}
 */
async function flush(timeout = 2000) {
  return Sentry.close(timeout);
}

module.exports = {
  initSentry,
  captureError,
  captureMessage,
  addBreadcrumb,
  setTag,
  flush,
  Sentry,
};
