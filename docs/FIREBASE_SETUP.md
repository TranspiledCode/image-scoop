# Firebase Setup Guide

This guide will help you set up Firebase for Image Scoop to enable user authentication and realtime database features.

## Prerequisites

- A Google account
- Node.js and Yarn installed
- Image Scoop project cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `image-scoop` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the web icon (</>) to add a web app
2. Register app with nickname: "Image Scoop Web"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click, toggle "Enable", Save
   - **Google**: Click, toggle "Enable", add support email, Save

## Step 4: Set Up Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click "Create Database"
3. Choose location (e.g., `us-central1`)
4. Start in **test mode** (we'll add security rules later)
5. Click "Enable"

## Step 5: Configure Security Rules

1. In Realtime Database, go to the **Rules** tab
2. Replace the default rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "profile": {
          ".validate": "newData.hasChildren(['email', 'createdAt'])"
        },
        "preferences": {
          ".validate": "newData.hasChildren(['defaultExportFormat', 'omitFilename'])"
        },
        "history": {
          "$historyId": {
            ".validate": "newData.hasChildren(['exportFormat', 'processedAt', 'originalSize', 'compressedSize'])"
          }
        }
      }
    }
  }
}
```

3. Click "Publish"

## Step 6: Add Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration values from Step 2:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
   ```

## Step 7: Update Netlify Environment Variables

If deploying to Netlify, add the same environment variables:

1. Go to Netlify Dashboard > Site Settings > Environment Variables
2. Add each `REACT_APP_FIREBASE_*` variable
3. Redeploy your site

## Step 8: Test the Integration

1. Start the development server:
   ```bash
   yarn dev
   ```

2. Try signing up with a test account
3. Verify user appears in Firebase Console > Authentication
4. Check that user data is created in Realtime Database

## Database Structure

```
users/
  {userId}/
    profile/
      email: string
      displayName: string
      photoURL: string (optional)
      createdAt: timestamp
    preferences/
      defaultExportFormat: "webp" | "jpeg" | "png"
      omitFilename: boolean
    history/
      {processId}/
        originalFiles: string[]
        exportFormat: string
        processedAt: timestamp
        originalSize: number
        compressedSize: number
        compressionRatio: number
        filesProcessed: number
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** for all Firebase config
3. **Keep security rules strict** - Users can only access their own data
4. **Enable App Check** (optional) - Protects against abuse
5. **Monitor usage** - Check Firebase Console for unusual activity

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that all environment variables are set correctly
- Verify Firebase project is created and web app is registered

### "Permission denied" errors
- Check Firebase security rules are published
- Verify user is authenticated before accessing database

### Authentication not persisting
- Check that cookies are enabled in browser
- Verify `authDomain` is correct in environment variables

## Optional Enhancements

### Anonymous Authentication
Enable anonymous sign-in for trial users:
1. Go to Authentication > Sign-in method
2. Enable "Anonymous"
3. Update code to support anonymous users

### Additional OAuth Providers
Add GitHub, Twitter, etc.:
1. Enable provider in Firebase Console
2. Configure OAuth app in provider's developer console
3. Add credentials to Firebase

### Firebase Analytics
Track user behavior:
1. Enable Google Analytics in Firebase project settings
2. Add Analytics SDK to project
3. Configure custom events

## Support

For issues or questions:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- Image Scoop GitHub Issues

## Cost Considerations

Firebase offers a generous free tier:
- **Authentication**: 50,000 MAU (Monthly Active Users)
- **Realtime Database**: 1GB storage, 10GB/month transfer
- **Hosting**: 10GB storage, 360MB/day transfer

Monitor usage in Firebase Console > Usage and billing.
