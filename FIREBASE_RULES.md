# Firebase Realtime Database Security Rules

This document explains the security rules implemented for Image Scoop's Firebase Realtime Database.

## Overview

Our security rules follow these core principles:

1. **Authenticated Users Only** - All database access requires authentication
2. **User Data Isolation** - Users can only access their own data
3. **Server-Only Writes** - Sensitive data (usage, subscriptions) can only be written by backend
4. **Data Validation** - All writable fields have strict validation rules
5. **Least Privilege** - Minimum necessary permissions granted

## Database Structure

```
/
├── users/
│   └── $userId/
│       ├── profile/           (read/write by user)
│       ├── preferences/       (read/write by user)
│       ├── subscription/      (read by user, write by server only)
│       ├── usage/             (read by user, write by server only)
│       ├── history/           (read by user, write by server only)
│       └── apiKeys/           (no client access - server only)
└── pricing/                   (read by all, write by server only)
```

## Rules Breakdown

### User Profile (`users/$userId/profile`)

**Access**: User can read and write their own profile

**Required Fields**:
- `displayName` (string, 1-100 chars)
- `email` (string, valid email format)

**Optional Fields**:
- `photoURL` (string)
- `createdAt` (number, immutable once set)
- `lastLogin` (number)

**Example**:
```javascript
const userId = auth.currentUser.uid;
await database.ref(`users/${userId}/profile`).set({
  displayName: "John Doe",
  email: "john@example.com",
  photoURL: "https://example.com/photo.jpg",
  createdAt: Date.now(),
  lastLogin: Date.now()
});
```

### User Preferences (`users/$userId/preferences`)

**Access**: User can read and write their own preferences

**Valid Fields**:
- `defaultExportFormat`: `"webp"` | `"avif"` | `"jpeg"` | `"png"`
- `defaultQuality`: number (1-100)
- `omitFilenameFromOutput`: boolean
- `emailNotifications`: boolean
- `theme`: `"light"` | `"dark"` | `"auto"`

**Example**:
```javascript
await database.ref(`users/${userId}/preferences`).update({
  defaultExportFormat: "webp",
  defaultQuality: 85,
  omitFilenameFromOutput: false,
  emailNotifications: true,
  theme: "auto"
});
```

### User Subscription (`users/$userId/subscription`)

**Access**:
- **Read**: User can read their own subscription data
- **Write**: Server only (via Firebase Admin SDK)

**Fields**:
- `plan`: `"free"` | `"basic"` | `"pro"` | `"business"`
- `stripeCustomerId`: string
- `stripeSubscriptionId`: string
- `status`: `"active"` | `"canceled"` | `"past_due"` | `"unpaid"` | `"trialing"`
- `currentPeriodEnd`: number (timestamp)
- `currentPeriodStart`: number (timestamp)
- `cancelAtPeriodEnd`: boolean

**Client (Read Only)**:
```javascript
// ✅ Allowed: User reading their subscription
const subscription = await database.ref(`users/${userId}/subscription`).once('value');
console.log(subscription.val());
```

**Server (Write)**:
```javascript
// ✅ Allowed: Server updating subscription (via Admin SDK in Netlify Function)
const admin = require('firebase-admin');
await admin.database().ref(`users/${userId}/subscription`).update({
  plan: "pro",
  status: "active",
  currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000
});
```

### User Usage (`users/$userId/usage`)

**Access**:
- **Read**: User can read their own usage data
- **Write**: Server only

**Structure**:
```javascript
{
  currentMonth: {
    imagesProcessed: number,
    periodStart: number,
    periodEnd: number
  },
  allTime: {
    totalImages: number,
    totalBytesSaved: number
  }
}
```

**Server Update**:
```javascript
// In Netlify Function after processing images
await admin.database().ref(`users/${userId}/usage/currentMonth`).update({
  imagesProcessed: admin.database.ServerValue.increment(5),
  periodStart: monthStart,
  periodEnd: monthEnd
});

await admin.database().ref(`users/${userId}/usage/allTime`).update({
  totalImages: admin.database.ServerValue.increment(5),
  totalBytesSaved: admin.database.ServerValue.increment(bytesReduced)
});
```

### Processing History (`users/$userId/history`)

**Access**:
- **Read**: User can read their own history
- **Write**: Server only

**Indexed On**: `processedAt` (for efficient queries)

**Fields**:
- `processedAt`: number (timestamp)
- `fileCount`: number (> 0)
- `exportFormat`: `"webp"` | `"avif"` | `"jpeg"` | `"png"`
- `originalSize`: number (bytes, > 0)
- `compressedSize`: number (bytes, > 0)
- `compressionRatio`: number (0-100)

**Client (Read)**:
```javascript
// Get last 20 processing jobs
const history = await database
  .ref(`users/${userId}/history`)
  .orderByChild('processedAt')
  .limitToLast(20)
  .once('value');
```

**Server (Write)**:
```javascript
// In Netlify Function after processing
const processId = `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
await admin.database().ref(`users/${userId}/history/${processId}`).set({
  processedAt: Date.now(),
  fileCount: 5,
  exportFormat: "webp",
  originalSize: 5242880,  // 5 MB
  compressedSize: 1048576, // 1 MB
  compressionRatio: 80
});
```

### API Keys (`users/$userId/apiKeys`)

**Access**:
- **Read**: Server only (no client access)
- **Write**: Server only

API keys must never be accessible from the client. All API key operations must go through Netlify Functions.

### Pricing (`/pricing`)

**Access**:
- **Read**: Everyone (even unauthenticated users)
- **Write**: Server only

**Structure**:
```javascript
{
  free: {
    name: "Free",
    price: 0,
    imagesPerMonth: 10,
    features: { ... }
  },
  basic: {
    name: "Basic",
    price: 9,
    imagesPerMonth: 100,
    features: { ... }
  }
  // ...
}
```

**Client (Read)**:
```javascript
// ✅ Allowed: Anyone can read pricing (even logged out)
const pricing = await database.ref('pricing').once('value');
```

## Security Best Practices

### ✅ DO

- **Validate all user input** on both client and server
- **Use Firebase Admin SDK** in Netlify Functions for server operations
- **Check authentication** before any database operation
- **Validate data types** in rules (isString, isNumber, isBoolean)
- **Enforce required fields** with `.validate` rules
- **Limit string lengths** to prevent abuse
- **Use enums** for fixed value fields (format, plan, theme)
- **Make timestamps immutable** where appropriate (createdAt)
- **Index fields** used in queries (processedAt)
- **Test rules** in Firebase Console Rules Playground

### ❌ DON'T

- **Never allow public write** (`".write": true`)
- **Never store secrets** in client-accessible fields
- **Never trust client data** - always validate on server
- **Never skip validation** - all writable fields need `.validate`
- **Never allow cross-user access** - always check `auth.uid === $userId`
- **Never expose API keys** to client code

## Testing Rules

### Firebase Console Rules Playground

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Navigate to **Realtime Database** > **Rules**
4. Click **Rules Playground**

Test scenarios:
```javascript
// Test 1: User reading their own profile
Location: /users/user123/profile
Read: true
Simulate: Authenticated user with uid "user123"
Expected: ✅ Allowed

// Test 2: User reading another user's profile
Location: /users/user456/profile
Read: true
Simulate: Authenticated user with uid "user123"
Expected: ❌ Denied

// Test 3: User writing to their subscription
Location: /users/user123/subscription
Write: { plan: "pro" }
Simulate: Authenticated user with uid "user123"
Expected: ❌ Denied (only server can write)

// Test 4: User reading pricing
Location: /pricing
Read: true
Simulate: Unauthenticated
Expected: ✅ Allowed
```

### Unit Tests (Optional)

You can write automated tests using `@firebase/rules-unit-testing`:

```bash
npm install --save-dev @firebase/rules-unit-testing
```

```javascript
// Example test
const { assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

describe('User data rules', () => {
  it('should allow user to read their own profile', async () => {
    const db = authedApp({ uid: 'user123' });
    await assertSucceeds(db.ref('users/user123/profile').once('value'));
  });

  it('should deny user from reading other user profile', async () => {
    const db = authedApp({ uid: 'user123' });
    await assertFails(db.ref('users/user456/profile').once('value'));
  });
});
```

## Deployment

### Prerequisites

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Configure Project ID**:
   Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```

### Deploy Rules

**Using yarn (recommended)**:
```bash
yarn deploy:rules
```

**Using the deployment script**:
```bash
./deploy-rules.sh
```

**Or manually**:
```bash
firebase deploy --only database --project image-scoop
```

**Deploy all Firebase resources**:
```bash
yarn deploy:firebase
```

**Deploy to specific environment** (using script):
```bash
./deploy-rules.sh production
```

### Verify Deployment

1. Check Firebase Console: https://console.firebase.google.com/project/YOUR_PROJECT/database/rules
2. Verify rules are active
3. Test with Rules Playground
4. Monitor for denied requests

## Monitoring

### Firebase Console

Monitor security rule performance:
1. Go to **Realtime Database** > **Usage**
2. Check for denied requests
3. Review access patterns
4. Set up alerts for suspicious activity

### Logging in Functions

Log security-related events:
```javascript
// In Netlify Functions
if (!hasPermission) {
  console.error('Unauthorized access attempt:', {
    userId: user.uid,
    resource: path,
    action: 'write',
    timestamp: Date.now()
  });
}
```

## Troubleshooting

### Common Issues

**"Permission denied" errors**:
- Verify user is authenticated
- Check that `auth.uid` matches `$userId` in path
- Ensure rules are deployed
- Test in Rules Playground

**"Data validation failed"**:
- Check field types match rules
- Verify required fields are present
- Check string lengths and value ranges
- Test with malformed data

**Rules not updating**:
- Wait 1-2 minutes for propagation
- Clear client SDK cache
- Verify deployment succeeded
- Check Firebase Console shows new rules

## Maintenance

### Regular Tasks

- **Monthly**: Review access patterns and denied requests
- **Quarterly**: Audit rules for security issues
- **After major features**: Update rules for new data structures
- **Before release**: Test all rule changes thoroughly

### Updating Rules

1. Edit `database.rules.json`
2. Test locally (if using emulator)
3. Deploy to staging (if available)
4. Test thoroughly
5. Deploy to production
6. Monitor for issues

## Related Files

- `database.rules.json` - Security rules definition
- `firebase.json` - Firebase project configuration
- `.firebaserc` - Project ID mapping
- `deploy-rules.sh` - Deployment script
- `src/config/firebase.js` - Client SDK configuration

## Support

For questions or issues:
- Firebase Documentation: https://firebase.google.com/docs/database/security
- Firebase Console: https://console.firebase.google.com
- Issue Tracker: GitHub Issues

## Security

If you discover a security vulnerability, please email security@example.com immediately. Do not create a public issue.
