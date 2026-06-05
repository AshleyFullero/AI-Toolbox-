'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-2">
              An unexpected error occurred. Our team has been notified.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mb-6 font-mono">
                Error ID: {error.digest}
              </p>
            )}
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
