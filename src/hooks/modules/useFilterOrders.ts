import { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'

import {
  GET_ORDERS_CUSTOMER,
  GET_ORDERS_DATE_RANGE,
  GET_ORDERS_NO_FILTER,
} from '@/graphql/queries/orders'

import { DEBOUNCE_MS, PAGE_SIZE } from '@/utils/constants'

import { useDebounce } from '@/hooks/useDebounce'

import { SortDirection } from '@/types/common'
import { ORDER_FIELDS, ORDER_FILTERS } from '@/types/modules/order'
import type { OrdersConnection } from '@/types/modules/order'

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
  const customerName = (debouncedFilters.customer ?? '').trim()
  const hasCustomer = customerName.length > 0

  const dateFrom = debouncedFilters.dateFrom ?? null
  const dateTo = debouncedFilters.dateTo ?? null
  const hasDateRange = Boolean(dateFrom) && Boolean(dateTo)

  const paginationVars =
    cursorState.direction === 'forward'
      ? { first: PAGE_SIZE, after: cursorState.cursor ?? null }
      : { last: PAGE_SIZE, before: cursorState.cursor ?? null }

  const order =
    sortConfig.field === ORDER_FIELDS.CUSTOMER
      ? [{ customer: { companyName: sortConfig.direction } }]
      : [{ [sortConfig.field]: sortConfig.direction }]

  const queryDoc = hasCustomer
    ? GET_ORDERS_CUSTOMER
    : hasDateRange
      ? GET_ORDERS_DATE_RANGE
      : GET_ORDERS_NO_FILTER

  const variables: any = {
    ...paginationVars,
    order,
    ...(hasCustomer ? { customerName } : {}),
    ...(hasDateRange ? { dateFrom, dateTo } : {}),
  }

  const { data, loading, error, refetch } = useQuery<{ orders: OrdersConnection }>(queryDoc, {
    variables,
  })

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
