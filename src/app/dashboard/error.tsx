'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto mb-4">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h2 className="text-xl font-bold mb-2">Dashboard failed to load</h2>
      <p className="text-muted-foreground text-sm mb-6">
        {error.message || 'Something went wrong. Please try again.'}
      </p>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
