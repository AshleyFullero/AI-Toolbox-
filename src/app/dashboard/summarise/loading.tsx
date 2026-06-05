import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SummariseLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
