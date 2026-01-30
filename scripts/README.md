# Pricing Management Scripts

## Overview

The pricing data for Image Scoop is stored in Firebase Realtime Database under the `/pricing` path. This allows you to update pricing without deploying new code.

## Data Structure

```json
{
  "pricing": {
    "plans": {
      "free": { ... },
      "pay-as-you-go": { ... },
      "plus": { ... },
      "pro": { ... }
    },
    "metadata": {
      "lastUpdated": 1234567890,
      "version": "1.0.0",
      "annualDiscount": 0.2
    }
  }
}
```

### Plan Object Structure

```json
{
  "id": "plus",
  "name": "Plus",
  "description": "For creators & small businesses",
  "price": 5,
  "period": "per month",
  "cta": "Start Free Trial",
  "featured": true,
  "payAsYouGo": false,
  "order": 3,
  "features": [
    "100 images per day (~3,000/month)",
    "6 variants (xs, s, m, l, xl, xxl)",
    ...
  ],
  "limits": {
    "dailyImages": 100,
    "fileSize": 20,
    "batchSize": 10,
    "historyDays": 7
  }
}
```

### Pay-As-You-Go Additional Fields

```json
{
  ...
  "payAsYouGo": true,
  "packs": [
    { "scoops": 100, "price": 5, "pricePerScoop": 0.05 },
    { "scoops": 250, "price": 10, "pricePerScoop": 0.04 },
    { "scoops": 600, "price": 20, "pricePerScoop": 0.033 }
  ]
}
```

## Usage

### Upload Pricing Data to Firebase

```bash
yarn upload:pricing
```

This command runs `scripts/uploadPricing.mjs` which uploads the pricing data to Firebase.

### Update Pricing

1. Edit `scripts/uploadPricing.mjs`
2. Modify the `pricingData` object
3. Run `yarn upload:pricing`
4. Changes will be reflected on the website immediately (users may need to refresh)

### Testing Locally

The Pricing component (`src/components/marketing/Pricing.jsx`) uses the `usePricing` hook which:
- Fetches pricing from Firebase in real-time
- Falls back to hardcoded pricing if Firebase is unavailable
- Shows a loading state while fetching

### Fallback Pricing

The hardcoded fallback pricing is defined in `src/hooks/usePricing.js` in the `getFallbackPricing()` function. This ensures the site works even if Firebase is down.

## Important Notes

- **Order Field**: The `order` field (1, 2, 3, 4) determines the display order of plans
- **Featured Flag**: Only one plan should have `featured: true` (shows "Most Popular" badge)
- **Annual Discount**: Stored in `metadata.annualDiscount` (0.2 = 20% discount)
- **Limits Object**: Used for enforcing plan limits in the application (not just display)
- **Pay-As-You-Go**: The `packs` array defines the scoop bundle options

## Updating Limits vs Features

- **Features Array**: User-facing bullet points shown on the pricing page
- **Limits Object**: Programmatic values used to enforce restrictions in the app

Keep these in sync when updating pricing!

## Firebase Database Rules

Ensure your Firebase Realtime Database rules allow:
- **Public read access** to `/pricing` (so the website can fetch it)
- **Admin write access** only (protect against unauthorized updates)

Example rules:
```json
{
  "rules": {
    "pricing": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    }
  }
}
```

## Future Enhancements

- Admin dashboard for editing pricing directly in Firebase Console
- Pricing history/versioning
- A/B testing different pricing tiers
- Regional pricing support
- Promotional pricing with expiration dates
