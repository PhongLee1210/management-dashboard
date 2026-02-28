import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useFilterOrders } from '@/hooks/modules/useFilterOrders'
import { formatDate, formatCurrency } from '@/utils/formatters'

import { FilterBar } from '@/components/modules/components/data-list/FilterBar'
import { DataList } from '@/components/modules/components/data-list/DataList'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Badge } from '@/components/ui/badge'

import { ORDER_FIELDS, ORDER_FILTERS, type Order } from '@/types/modules/order'

import type {
  ColumnConfig,
  FilterFieldConfig,
} from '@/components/modules/components/data-list/type'

const FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: ORDER_FILTERS.CUSTOMER,
    label: 'Customer',
    type: 'text',
    placeholder: 'Search customer…',
  },
  { key: ORDER_FILTERS.DATE_FROM, label: 'From Date', type: 'date' },
  { key: ORDER_FILTERS.DATE_TO, label: 'To Date', type: 'date' },
]

const COLUMNS: ColumnConfig<Order>[] = [
  {
    key: ORDER_FIELDS.ORDER_ID,
    label: 'Order ID',
    render: (o) => <span className="font-semibold text-primary font-mono">#{o.id}</span>,
  },
  {
    key: ORDER_FIELDS.ORDER_DATE,
    label: 'Order Date',
    render: (o) => <span className="text-foreground tabular-nums">{formatDate(o.orderDate)}</span>,
  },
  {
    key: ORDER_FIELDS.CUSTOMER,
    label: 'Customer',
    render: (o) =>
      o.customer ? (
        <span className="text-primary font-medium hover:underline cursor-pointer">
          {o.customer.companyName}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: ORDER_FIELDS.SHIPPED_DATE,
    label: 'Status',
    render: (o) =>
      o.shippedDate ? (
        <Badge
          variant="default"
          className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-normal"
        >
          Shipped {formatDate(o.shippedDate)}
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-normal"
        >
          Pending
        </Badge>
      ),
  },
  {
    key: ORDER_FIELDS.FREIGHT,
    label: 'Freight',
    render: (o) => <span className="tabular-nums">{formatCurrency(o.freight)}</span>,
  },
  {
    key: ORDER_FIELDS.SHIP_NAME,
    label: 'Ship Name',
    render: (o) => <span className="text-muted-foreground">{o.shipName ?? '—'}</span>,
  },
]

export function OrderList() {
  const navigate = useNavigate()
  const {
    filters,
    setFilter,
    reset,
    sortConfig,
    onSort,
    goToNext,
    goToPrev,
    orders,
    pageInfo,
    loading,
    error,
    refetch,
  } = useFilterOrders()

  const onRowClick = useCallback(
    (order: Order) => {
      navigate(`/orders/${order.id}`)
    },
    [navigate]
  )

  const onCustomerNameClick = useCallback(
    (e: React.MouseEvent, customerId: string) => {
      e.stopPropagation()
      navigate(`/customers/${customerId}`)
    },
    [navigate]
  )

  const columnsWithNav: ColumnConfig<Order>[] = COLUMNS.map((col) => {
    if (col.key !== ORDER_FIELDS.CUSTOMER) return col
    return {
      ...col,
      render: (item) =>
        item.customer ? (
          <span
            className="text-primary font-medium hover:underline cursor-pointer"
            onClick={(e) => onCustomerNameClick(e, item.customer!.id)}
          >
            {item.customer.companyName}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    }
  })

  return (
    <section aria-label="Orders">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Orders</h1>

      <FilterBar fields={FILTER_FIELDS} values={filters} onChange={setFilter} onReset={reset} />

      {error && <ErrorMessage message={error.message} retry={refetch} />}

      <DataList
        columns={columnsWithNav}
        rows={orders}
        loading={loading}
        emptyMessage="No orders found."
        onRowClick={onRowClick}
        sortConfig={sortConfig}
        onSort={onSort}
        pageInfo={pageInfo}
        onNext={() => goToNext(pageInfo?.endCursor ?? null)}
        onPrev={() => goToPrev(pageInfo?.startCursor ?? null)}
      />
    </section>
  )
}
