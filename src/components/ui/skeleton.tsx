import * as React from 'react';
import { cn } from '@/lib/utils';

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('shimmer rounded-md bg-muted', className)}
      {...props}
    />
  );
};

export { Skeleton };
