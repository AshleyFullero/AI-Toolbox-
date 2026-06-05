import { Skeleton } from '@/components/ui/skeleton';

export default function ChatLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl h-[calc(100vh-5rem)] flex flex-col">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
            <Skeleton className="h-5 w-48 mx-auto" />
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
        </div>
        <div className="border-t p-3">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
