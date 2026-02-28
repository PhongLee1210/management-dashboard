import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  hasNextPage: boolean
  hasPreviousPage: boolean
  onNext: () => void
  onPrev: () => void
  loading?: boolean
}

export function Pagination({ hasNextPage, hasPreviousPage, onNext, onPrev, loading }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-card">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={!hasPreviousPage || loading}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {loading && (
        <span className="text-xs text-muted-foreground animate-pulse">Loading…</span>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasNextPage || loading}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
