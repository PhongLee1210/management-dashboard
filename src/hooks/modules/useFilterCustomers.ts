import { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'

import { GET_CUSTOMERS } from '@/graphql/queries/customers'

import { DEBOUNCE_MS, PAGE_SIZE } from '@/utils/constants'

import { useDebounce } from '@/hooks/useDebounce'

import { SortDirection } from '@/types/common'
import { CUSTOMER_FIELDS, CUSTOMER_FILTERS } from '@/types/modules/customer'
import type { CustomersConnection } from '@/types/modules/customer'

import type { CursorState } from './type'

export interface CustomerFilters extends Record<string, string> {
  companyName: string
  country: string
}

const EMPTY: CustomerFilters = {
  [CUSTOMER_FILTERS.COMPANY_NAME]: '',
  [CUSTOMER_FILTERS.COUNTRY]: '',
}

export function useFilterCustomers() {
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

  const [sortConfig, setSortConfig] = useState<{
    field: string
    direction: SortDirection
  }>({
    field: CUSTOMER_FIELDS.COMPANY_NAME,
    direction: SortDirection.ASC,
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

  const [filters, setFilters] = useState<CustomerFilters>(EMPTY)
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

  const paginationVars =
    cursorState.direction === 'forward'
      ? { first: PAGE_SIZE, after: cursorState.cursor }
      : { last: PAGE_SIZE, before: cursorState.cursor }

  const { data, loading, error, refetch } = useQuery<{ customers: CustomersConnection }>(
    GET_CUSTOMERS,
    {
      variables: {
        ...paginationVars,
        order: [{ [sortConfig.field]: sortConfig.direction }],
        companyName: debouncedFilters.companyName,
        country: debouncedFilters.country,
      },
    }
  )

  return {
    filters,
    setFilter,
    reset,
    sortConfig,
    onSort,
    goToNext,
    goToPrev,
    customers: data?.customers?.nodes ?? [],
    pageInfo: data?.customers?.pageInfo,
    loading,
    error,
    refetch,
  }
}
