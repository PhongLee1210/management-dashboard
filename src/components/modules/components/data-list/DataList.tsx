import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SortIcon } from '@/components/modules/components/data-list/components/SortIcon'
import { Pagination } from '@/components/modules/components/data-list/components/Pagination'
import { TableSkeleton } from './components/TableSkeleton'

import type { ColumnConfig, SortConfig } from '@/components/modules/components/data-list/type'
import type { PageInfo } from '@/types/common'

type DataListProps<T extends { id: string | number }> = {
  columns: ColumnConfig<T>[]
  emptyMessage: string
  loading: boolean
  onNext: () => void
  onPrev: () => void
  onRowClick: (row: T) => void
  onSort: (field: string) => void
  pageInfo: PageInfo | undefined
  rows: T[]
  sortConfig: SortConfig<string>
}

export function DataList<T extends { id: string | number }>({
  columns,
  rows,
  loading,
  emptyMessage,
  onRowClick,
  sortConfig,
  onSort,
  pageInfo,
  onNext,
  onPrev,
}: DataListProps<T>) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={
                    col.sortable !== false ? 'cursor-pointer select-none hover:bg-muted/50' : ''
                  }
                  onClick={col.sortable !== false ? () => onSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable !== false && (
                      <SortIcon
                        field={col.key}
                        activeField={sortConfig.field}
                        direction={sortConfig.direction}
                      />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton rows={10} cols={columns.length} />
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer" onClick={() => onRowClick(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render(row)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        hasNextPage={pageInfo?.hasNextPage ?? false}
        hasPreviousPage={pageInfo?.hasPreviousPage ?? false}
        onNext={onNext}
        onPrev={onPrev}
        loading={loading}
      />
    </div>
  )
}
