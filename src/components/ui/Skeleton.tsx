import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[3px] bg-paper-sunk', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div className="grid gap-3">
      <Skeleton className="aspect-4/5 w-full" />
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
