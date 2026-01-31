import { useUserSubscription } from './useUserSubscription';
import { useUserUsage } from './useUserUsage';
import { useAuth } from '../context/AuthContext';
import { useDemoUsage } from './useDemoUsage';
import { ref, runTransaction } from 'firebase/database';
import { database } from '../config/firebase';

const PLAN_LIMITS = {
  demo: {
    dailyLimit: 3, // Total limit, not daily
    batchSize: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    unlimited: false,
  },
  free: {
    dailyLimit: 20,
    batchSize: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    unlimited: false,
  },
  payAsYouGo: {
    dailyLimit: null,
    batchSize: 1,
    maxFileSize: 20 * 1024 * 1024, // 20MB
    unlimited: false,
    useScoops: true,
  },
  plus: {
    dailyLimit: 100,
    batchSize: 10,
    maxFileSize: 20 * 1024 * 1024, // 20MB
    unlimited: false,
  },
  pro: {
    dailyLimit: null,
    batchSize: 25,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    unlimited: true,
  },
};

export const useProcessingLimits = () => {
  const { currentUser } = useAuth();
  const { subscription } = useUserSubscription();
  const { imagesProcessedToday } = useUserUsage();
  const demoUsage = useDemoUsage();

  // If unauthenticated, use demo mode
  const isDemo = !currentUser;

  const planLimits = PLAN_LIMITS[subscription?.planId] || PLAN_LIMITS.free;

  const validateSubscriptionStatus = () => {
    // Check if trial expired
    if (
      subscription?.status === 'trialing' &&
      subscription?.trialEndDate < Date.now()
    ) {
      return {
        valid: false,
        reason: 'trial_expired',
        message:
          'Your 14-day trial has ended. Upgrade to continue processing images.',
      };
    }

    // Check if subscription canceled and period ended
    if (
      subscription?.status === 'canceled' &&
      subscription?.currentPeriodEnd &&
      subscription?.currentPeriodEnd < Date.now()
    ) {
      return {
        valid: false,
        reason: 'subscription_ended',
        message: 'Your subscription has ended. Please reactivate to continue.',
      };
    }

    return { valid: true };
  };

  const canProcess = (fileCount, fileSizes = []) => {
    // Demo mode (unauthenticated users)
    if (isDemo) {
      // Check batch size limit (demo = 1 image at a time)
      if (fileCount > PLAN_LIMITS.demo.batchSize) {
        return {
          allowed: false,
          reason: `Demo mode allows processing ${PLAN_LIMITS.demo.batchSize} image at a time. Sign up free to process more!`,
          limit: 'batch',
          isDemo: true,
        };
      }

      // Check if demo limit reached
      if (demoUsage.isDemoLimitReached) {
        return {
          allowed: false,
          reason: `Demo limit reached. Sign up free to get 20 images per day!`,
          limit: 'demo',
          isDemo: true,
        };
      }

      // Check if requested count exceeds remaining
      if (!demoUsage.canProcessDemo(fileCount)) {
        const remaining = demoUsage.remaining;
        return {
          allowed: false,
          reason: `Demo allows ${demoUsage.limit} total images. You have ${remaining} remaining. Sign up free for 20 images/day!`,
          limit: 'demo',
          isDemo: true,
        };
      }

      // Demo: Allow processing, single file only
      return {
        allowed: true,
        limit: 'demo',
        remaining: demoUsage.remaining,
        isDemo: true,
      };
    }

    // Authenticated users: Check subscription status first
    const statusCheck = validateSubscriptionStatus();
    if (!statusCheck.valid) {
      return {
        allowed: false,
        reason: statusCheck.message,
        limit: statusCheck.reason,
      };
    }

    // Check batch size limit
    if (fileCount > planLimits.batchSize) {
      return {
        allowed: false,
        reason: `Your plan allows processing ${planLimits.batchSize} image(s) at a time. Upgrade for larger batches.`,
        limit: 'batch',
      };
    }

    // Check file size limits
    const oversizedFiles = fileSizes.filter(
      (size) => size > planLimits.maxFileSize,
    );
    if (oversizedFiles.length > 0) {
      const maxMB = (planLimits.maxFileSize / (1024 * 1024)).toFixed(0);
      return {
        allowed: false,
        reason: `Some files exceed the ${maxMB}MB limit for your plan. Upgrade for larger file support.`,
        limit: 'fileSize',
      };
    }

    // Check PAYG scoop balance (primary for PAYG users)
    if (planLimits.useScoops) {
      const scoopBalance = subscription?.payAsYouGoBalance || 0;
      if (scoopBalance < fileCount) {
        return {
          allowed: false,
          reason: `Not enough scoops. You have ${scoopBalance} scoop(s), but need ${fileCount}.`,
          limit: 'scoops',
        };
      }
      return { allowed: true, limit: 'scoops', remaining: scoopBalance };
    }

    // Check daily limit (for Plus users, with scoop fallback)
    if (!planLimits.unlimited && planLimits.dailyLimit) {
      const remaining = planLimits.dailyLimit - imagesProcessedToday;

      if (remaining >= fileCount) {
        // Have enough daily limit remaining
        return { allowed: true, limit: 'daily', remaining };
      }

      // Daily limit exhausted or insufficient - check for scoop fallback
      const scoopBalance = subscription?.payAsYouGoBalance || 0;
      if (scoopBalance >= fileCount) {
        return {
          allowed: true,
          limit: 'scoops',
          remaining: scoopBalance,
          usingFallback: true,
        };
      }

      // Neither daily limit nor scoops available
      if (scoopBalance > 0) {
        return {
          allowed: false,
          reason: `Daily limit reached (${remaining} remaining). You have ${scoopBalance} backup scoop(s), but need ${fileCount}.`,
          limit: 'daily',
        };
      }

      return {
        allowed: false,
        reason: `Daily limit reached. You have ${remaining} image(s) remaining today. Consider buying backup scoops!`,
        limit: 'daily',
      };
    }

    // Pro unlimited
    return { allowed: true, limit: 'unlimited' };
  };

  const incrementUsage = async (imageCount) => {
    // Demo mode: increment demo usage
    if (isDemo) {
      demoUsage.incrementDemo(imageCount);
      return;
    }

    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0];
    const usageRef = ref(database, `users/${currentUser.uid}/usage`);

    await runTransaction(usageRef, (current) => {
      if (!current) {
        return {
          currentPeriodStart: Date.now(),
          imagesProcessedToday: imageCount,
          lastResetDate: today,
          totalImagesProcessed: imageCount,
        };
      }

      // Reset daily counter if it's a new day
      const shouldReset = current.lastResetDate !== today;

      return {
        ...current,
        imagesProcessedToday: shouldReset
          ? imageCount
          : current.imagesProcessedToday + imageCount,
        lastResetDate: today,
        totalImagesProcessed: current.totalImagesProcessed + imageCount,
      };
    });
  };

  const deductScoops = async (imageCount) => {
    if (!currentUser) return;

    const balanceRef = ref(
      database,
      `users/${currentUser.uid}/subscription/payAsYouGoBalance`,
    );

    await runTransaction(balanceRef, (currentBalance) => {
      if (currentBalance === null || currentBalance === 0) return 0;
      return Math.max(0, currentBalance - imageCount);
    });
  };

  const dailyRemaining = planLimits.dailyLimit
    ? Math.max(0, planLimits.dailyLimit - imagesProcessedToday)
    : null;

  const isNearLimit =
    planLimits.dailyLimit && dailyRemaining !== null
      ? dailyRemaining <= planLimits.dailyLimit * 0.2
      : false;

  return {
    canProcess,
    incrementUsage,
    deductScoops,
    validateSubscriptionStatus,
    planLimits,
    dailyRemaining,
    scoopBalance: subscription?.payAsYouGoBalance || 0,
    isNearLimit,
    isDemo,
    demoRemaining: isDemo ? demoUsage.remaining : null,
    demoLimit: isDemo ? demoUsage.limit : null,
    isDemoLimitReached: isDemo ? demoUsage.isDemoLimitReached : false,
  };
};

export default useProcessingLimits;
