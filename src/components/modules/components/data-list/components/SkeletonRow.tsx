import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

interface SkeletonRowProps {
  cols: number
}

export function SkeletonRow({ cols }: SkeletonRowProps) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i} className="py-3">
          <Skeleton className="h-4 w-3/4" />
        </TableCell>
      ))}
    </TableRow>
  )
}
