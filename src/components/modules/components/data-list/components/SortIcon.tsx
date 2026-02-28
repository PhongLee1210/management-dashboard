import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SortDirection } from '@/types/common'

interface SortIconProps {
  field: string
  activeField: string
  direction: SortDirection
}

export function SortIcon({ field, activeField, direction }: SortIconProps) {
  const isActive = field === activeField
  const Icon = !isActive ? ArrowUpDown : direction === SortDirection.ASC ? ArrowUp : ArrowDown
  return (
    <Icon
      className={cn(
        'ml-1 inline h-3.5 w-3.5',
        isActive ? 'text-primary' : 'text-muted-foreground/40'
      )}
    />
  )
}
