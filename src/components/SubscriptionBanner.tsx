'use client';

import { Zap, Lock, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SubscriptionBannerProps {
  className?: string;
  compact?: boolean;
}

const proFeatures = [
  '500 chat messages / day',
  '100 summarisations / day',
  '50 image generations / day',
  'Priority processing',
  'Chat history export',
];

export function SubscriptionBanner({
  className,
  compact = false,
}: SubscriptionBannerProps) {
  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-4 rounded-xl border border-brand-200 dark:border-brand-800 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/50 dark:to-purple-950/50 p-4',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground">Unlock unlimited AI access</p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-gradient-brand text-white hover:opacity-90 shrink-0"
          asChild
        >
          <Link href="/#pricing" id="subscription-banner-cta-compact">
            Upgrade <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 dark:from-brand-950/60 dark:via-purple-950/60 dark:to-pink-950/60 p-6',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-md">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <Badge
            variant="secondary"
            className="bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 border-0"
          >
            Pro Plan
          </Badge>
        </div>

        <h3 className="text-lg font-bold mb-1">Unlock Your Full AI Potential</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get unlimited access to all AI tools with our Pro plan.
        </p>

        <ul className="space-y-2 mb-5">
          {proFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-brand-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="bg-gradient-brand text-white hover:opacity-90 transition-opacity flex-1"
            asChild
          >
            <Link href="/#pricing" id="subscription-banner-cta">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none" asChild>
            <Link href="/#pricing" id="subscription-banner-learn-more">
              Learn more
            </Link>
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Secure payment via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
