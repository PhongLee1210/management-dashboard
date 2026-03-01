import { useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'

import {
  createOrdersQueryDocument,
  type OrdersData,
  type OrdersFilterVars,
} from '@/graphql/queries/orders'

import { DEBOUNCE_MS, PAGE_SIZE } from '@/utils/constants'

import { useDebounce } from '@/hooks/useDebounce'

import { SortDirection } from '@/types/common'
import { ORDER_FIELDS, ORDER_FILTERS } from '@/types/modules/order'

import type { CursorState } from './type'

export interface OrderFilters extends Record<string, string> {
  customer: string
  dateFrom: string
  dateTo: string
}

const EMPTY: OrderFilters = {
  [ORDER_FILTERS.CUSTOMER]: '',
  [ORDER_FILTERS.DATE_FROM]: '',
  [ORDER_FILTERS.DATE_TO]: '',
}

export function useFilterOrders() {
  const [cursorState, setCursorState] = useState<CursorState>({
    cursor: null,
    direction: 'forward',
  })

  const resetPage = useCallback(() => {
    setCursorState((prev) =>
      prev.cursor === null && prev.direction === 'forward'
        ? prev
        : { cursor: null, direction: 'forward' }
    )
  }, [])

  const goToNext = useCallback((endCursor: string | null) => {
    setCursorState({ cursor: endCursor, direction: 'forward' })
  }, [])

  const goToPrev = useCallback((startCursor: string | null) => {
    setCursorState({ cursor: startCursor, direction: 'backward' })
  }, [])

  const [sortConfig, setSortConfig] = useState<{ field: string; direction: SortDirection }>({
    field: ORDER_FIELDS.ORDER_DATE,
    direction: SortDirection.DESC,
  })

  const onSort = useCallback(
    (field: string) => {
      setSortConfig((prev) => ({
        field,
        direction:
          prev.field === field && prev.direction === SortDirection.ASC
            ? SortDirection.DESC
            : SortDirection.ASC,
      }))
      resetPage()
    },
    [resetPage]
  )

  const [filters, setFilters] = useState<OrderFilters>(EMPTY)
  const debouncedFilters = useDebounce(filters, DEBOUNCE_MS)

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setFilters(EMPTY)
  }, [])

  useEffect(() => {
    resetPage()
  }, [debouncedFilters, resetPage])

  const customerName = (debouncedFilters.customer ?? '').trim() || undefined
  const dateFrom = debouncedFilters.dateFrom ?? undefined
  const dateTo = debouncedFilters.dateTo ?? undefined

  const queryDoc = useMemo(
    () =>
      createOrdersQueryDocument({
        customerName,
        dateFrom,
        dateTo,
      }),
    [customerName, dateFrom, dateTo]
  )

  const paginationVars =
    cursorState.direction === 'forward'
      ? { first: PAGE_SIZE, after: cursorState.cursor ?? null }
      : { last: PAGE_SIZE, before: cursorState.cursor ?? null }

  const order =
    sortConfig.field === ORDER_FIELDS.CUSTOMER
      ? [{ customer: { companyName: sortConfig.direction } }]
      : [{ [sortConfig.field]: sortConfig.direction }]

  const variables: OrdersFilterVars = {
    ...paginationVars,
    order,
    customerName,
    dateFrom,
    dateTo,
  }

  const { data, loading, error, refetch } = useQuery<OrdersData>(queryDoc, { variables })

  return {
    filters,
    setFilter,
    reset,
    sortConfig,
    onSort,
    goToNext,
    goToPrev,
    orders: data?.orders?.nodes ?? [],
    pageInfo: data?.orders?.pageInfo,
    loading,
    error,
    refetch,
  }
}
