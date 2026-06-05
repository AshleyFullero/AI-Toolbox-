import Stripe from 'stripe';

/**
 * Stripe client initialisation.
 * Will be undefined in environments where STRIPE_SECRET_KEY is not set.
 * Check for undefined before using in production code.
 */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  : null;

/**
 * Subscription plan limits.
 */
export const PLAN_LIMITS = {
  FREE: {
    chatMessages: 20,     // per day
    summaries: 10,        // per day
    imageGenerations: 3,  // per day
  },
  PRO: {
    chatMessages: 500,
    summaries: 100,
    imageGenerations: 50,
  },
  ENTERPRISE: {
    chatMessages: Infinity,
    summaries: Infinity,
    imageGenerations: Infinity,
  },
} as const;

/**
 * Stripe pricing IDs (set these in your Stripe dashboard and env vars).
 */
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? 'price_placeholder_pro_monthly',
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? 'price_placeholder_pro_yearly',
};
