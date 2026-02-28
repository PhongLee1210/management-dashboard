import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
