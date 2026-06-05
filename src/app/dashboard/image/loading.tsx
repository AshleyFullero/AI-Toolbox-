import { Skeleton } from '@/components/ui/skeleton';

export default function ImageLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-[120px] w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <Skeleton className="aspect-square rounded-2xl" />
      </div>
    </div>
  );
}
