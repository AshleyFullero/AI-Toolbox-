import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools skeleton */}
      <Skeleton className="h-5 w-28 mb-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-12 w-12 rounded-2xl" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
