import type { ReactNode } from 'react'

import type { SortDirection } from '@/types/common'

export interface SortConfig<T extends string> {
  field: T
  direction: SortDirection
}

export interface ColumnConfig<T> {
  key: string
  label: string
  sortable?: boolean
  render: (row: T) => ReactNode
}

export interface FilterFieldConfig {
  key: string
  label: string
  type: 'text' | 'date'
  placeholder?: string
}
