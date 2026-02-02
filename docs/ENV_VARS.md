# Environment Variables Documentation

Complete guide to environment variables used in Image Scoop.

## Table of Contents

- [Naming Convention Rules](#naming-convention-rules)
- [Frontend Variables](#frontend-variables)
- [Backend Variables](#backend-variables)
- [Setup Guide](#setup-guide)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Naming Convention Rules

### Why Two Different Naming Styles?

Image Scoop follows **Create React App's** convention for environment variables:

| Prefix | Where Available | Visibility | Use Case |
|--------|----------------|------------|----------|
| `REACT_APP_` | Frontend (Browser) | **Public** | Public API keys, config |
| (no prefix) | Backend (Netlify Functions) | **Private** | Secrets, credentials |

### Frontend Variables (REACT_APP_ prefix)

```javascript
// ✅ CORRECT - Frontend variable
const apiUrl = process.env.REACT_APP_API_URL;
```

**Rules:**
- MUST use `REACT_APP_` prefix
- Accessible in React components
- Bundled into frontend JavaScript
- **Visible in browser DevTools**
- ⚠️ **NEVER put secrets here!**

**Use for:**
- API endpoints
- Public Firebase config
- Public API keys (Stripe publishable key, etc.)
- Feature flags
- Public identifiers

### Backend Variables (NO prefix)

```javascript
// ✅ CORRECT - Backend variable (Netlify Function)
const secretKey = process.env.R2_SECRET_ACCESS_KEY;
```

**Rules:**
- MUST NOT use `REACT_APP_` prefix
- Only available in Netlify Functions
- Never bundled into frontend
- **Not visible to browser**
- ✅ Safe for secrets

**Use for:**
- API secrets
- Database credentials
- Private keys
- Access tokens
- Webhook signatures

---

## Frontend Variables

### REACT_APP_API_URL

**Type:** Frontend
**Required:** Yes
**Default:** `/.netlify/functions/process-image`

API endpoint for image processing. Points to Netlify Function.

```bash
REACT_APP_API_URL=/.netlify/functions/process-image
```

**Used in:** `src/hooks/useFileProcessor.js`

### Firebase Client SDK Variables

**Type:** Frontend (all 7 variables)
**Required:** Yes
**Security:** Public keys - safe to expose

These variables configure the Firebase JavaScript SDK for client-side authentication and database access.

```bash
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc
REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

**Where to get these:**
1. Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Select web app or create one
4. Copy the `firebaseConfig` values

**Used in:**
- `src/config/firebase.js`
- `src/config/firebase-lazy.js`
- `src/context/AuthContextLazy.jsx`

**Note:** Firebase API keys are **public** and safe to expose. They identify your Firebase project but don't grant access without authentication rules.

### REACT_APP_FIREBASE_MEASUREMENT_ID

**Type:** Frontend
**Required:** No
**Default:** None

Google Analytics 4 measurement ID for tracking.

```bash
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Backend Variables

### Cloudflare R2 Storage

**Type:** Backend (all 4 variables)
**Required:** Yes
**Security:** Private credentials

S3-compatible object storage for image uploads and processed files.

```bash
R2_ACCOUNT_ID=abc123...
R2_ACCESS_KEY_ID=def456...
R2_SECRET_ACCESS_KEY=xyz789...
R2_BUCKET_NAME=image-scoop-storage
```

**Where to get these:**
1. Cloudflare Dashboard → R2
2. Create bucket (if needed)
3. Manage R2 API Tokens → Create API Token
4. Copy Account ID, Access Key ID, Secret Access Key
5. Note your bucket name

**Used in:**
- `Netlify/functions/get-upload-urls.js`
- `Netlify/functions/process-from-r2.js`

**Permissions needed:**
- Object Read & Write
- Bucket access for your specific bucket

### Cloudflare Images

**Type:** Backend
**Required:** Only for `scripts/upload-backgrounds.js`
**Security:** Private credentials

Used by maintenance script to upload background images.

```bash
CLOUDFLARE_ACCOUNT_ID=abc123...
CLOUDFLARE_API_KEY=def456...
```

**Where to get these:**
1. Cloudflare Dashboard → Images
2. Account ID: Copy from URL or Images page
3. API Token: My Profile → API Tokens → Create Token
4. Use "Edit Cloudflare Images" template

**Used in:**
- `scripts/upload-backgrounds.js`

### Firebase Admin SDK

**Type:** Backend (4 variables)
**Required:** Yes
**Security:** Private credentials - NEVER expose to frontend

Server-side Firebase SDK for authenticated operations in Netlify Functions.

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

**Where to get these:**
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download JSON file
4. Extract values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep `\n` escaped)
   - Database URL from Realtime Database section

**Used in:**
- `Netlify/functions/update-stats.js`

**⚠️ CRITICAL:**
- These credentials grant **full admin access** to your Firebase project
- NEVER commit to git
- NEVER use `REACT_APP_` prefix
- Rotate immediately if exposed

---

## Setup Guide

### Local Development

1. **Copy example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in values:**
   Edit `.env` with your actual credentials (see sections above for where to get each value).

3. **Verify .gitignore:**
   ```bash
   grep "^\.env$" .gitignore
   ```
   Should output: `.env` (confirms it won't be committed)

4. **Start development server:**
   ```bash
   netlify dev
   ```
   This loads `.env` automatically and makes variables available to both frontend and functions.

### Netlify Deployment

1. **Set environment variables in Netlify UI:**
   - Go to: Site Settings → Environment Variables
   - Add each variable individually
   - Set the same values as your local `.env`

2. **Or import from .env file:**
   ```bash
   netlify env:import .env
   ```
   This uploads all variables to Netlify.

3. **Verify variables:**
   ```bash
   netlify env:list
   ```

4. **Redeploy after changes:**
   Environment variable changes require a redeploy to take effect.

---

## Security Best Practices

### DO ✅

- Use `REACT_APP_` prefix for frontend variables
- Keep secrets in backend-only variables (no prefix)
- Add `.env` to `.gitignore`
- Use different credentials for development and production
- Rotate keys immediately if exposed
- Use Netlify's built-in environment variable management
- Document which variables are required

### DON'T ❌

- Commit `.env` file to git
- Put secrets in `REACT_APP_` variables
- Share credentials in chat/email
- Use production credentials in development
- Hardcode credentials in source code
- Use `REACT_APP_` prefix for backend variables

### Variable Checklist

Before deploying:

```bash
# Frontend variables (should see values in output)
echo $REACT_APP_API_URL
echo $REACT_APP_FIREBASE_API_KEY

# Backend variables (should be set but NOT visible in browser)
netlify env:list | grep R2_
netlify env:list | grep FIREBASE_
```

---

## Troubleshooting

### Frontend Variable Not Available

**Symptom:** `process.env.REACT_APP_MY_VAR` is `undefined`

**Solutions:**
1. Check variable has `REACT_APP_` prefix
2. Restart dev server after adding variable
3. Clear build cache:
   ```bash
   rm -rf .parcel-cache dist
   netlify dev
   ```
4. Check for typos in variable name

### Backend Variable Not Available

**Symptom:** `process.env.MY_VAR` is `undefined` in Netlify Function

**Solutions:**
1. Verify variable does NOT have `REACT_APP_` prefix
2. Check `.env` file exists and has the variable
3. Verify Netlify environment variables are set
4. Redeploy after adding variables in Netlify UI

### Firebase Connection Failed

**Symptoms:**
- "Failed to initialize Firebase"
- "Invalid API key"
- "Database not found"

**Solutions:**
1. Verify all 7 frontend Firebase variables are set correctly
2. Check for trailing spaces or quotes in `.env`
3. Ensure project ID matches your Firebase project
4. Verify Firebase Realtime Database is enabled
5. Check Firebase API key is correct (from Firebase Console)

### R2 Storage Errors

**Symptoms:**
- "Access denied"
- "Bucket not found"
- "Invalid credentials"

**Solutions:**
1. Verify R2 API token has correct permissions
2. Check bucket name is exact match (case-sensitive)
3. Ensure R2_ACCOUNT_ID matches your Cloudflare account
4. Regenerate API token if needed
5. Check token hasn't expired

### Netlify Function Crashes

**Symptom:** Function returns 500 error or crashes silently

**Check logs:**
```bash
netlify functions:log
```

**Common causes:**
1. Missing required environment variable
2. Typo in variable name
3. Variable not set in Netlify UI
4. Malformed value (e.g., missing quotes around private key)

### Private Key Format Issues

Firebase private keys must preserve newlines.

**Correct format in .env:**
```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"
```

**In code, convert `\n` to actual newlines:**
```javascript
process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
```

---

## Additional Resources

- [Create React App: Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Netlify: Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Firebase: Web Setup](https://firebase.google.com/docs/web/setup)
- [Cloudflare R2: API Tokens](https://developers.cloudflare.com/r2/api/s3/tokens/)

---

## Summary: Variable Usage by File

### Frontend Files

| File | Variables Used |
|------|---------------|
| `src/config/firebase.js` | All `REACT_APP_FIREBASE_*` (7 vars) |
| `src/config/firebase-lazy.js` | All `REACT_APP_FIREBASE_*` (7 vars) |
| `src/context/AuthContextLazy.jsx` | All `REACT_APP_FIREBASE_*` (7 vars) |
| `src/hooks/useFileProcessor.js` | `REACT_APP_API_URL` |
| `src/index.jsx` | `NODE_ENV` (standard) |
| `src/components/ErrorBoundary.jsx` | `NODE_ENV` (standard) |

### Backend Files

| File | Variables Used |
|------|---------------|
| `Netlify/functions/get-upload-urls.js` | `R2_*` (4 vars) |
| `Netlify/functions/process-from-r2.js` | `R2_*` (4 vars) |
| `Netlify/functions/update-stats.js` | `FIREBASE_*` backend (4 vars) |
| `scripts/upload-backgrounds.js` | `CLOUDFLARE_*` (2 vars), `R2_ACCOUNT_ID` |

### Notes

- **Sentry DSN** is currently hardcoded in `src/index.jsx` and `scripts/upload-backgrounds.js` - this is acceptable since DSNs are public identifiers
- **NODE_ENV** is a standard Node.js variable, automatically set by build tools
- Some variables like `FIREBASE_PROJECT_ID` and `FIREBASE_DATABASE_URL` appear in both frontend and backend configs but serve different purposes (client SDK vs. Admin SDK)
