import { useNavigate } from 'react-router-dom'

import { useFilterCustomers } from '@/hooks/modules/useFilterCustomers'

import { FilterBar } from '@/components/modules/components/data-list/FilterBar'
import { DataList } from '@/components/modules/components/data-list/DataList'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Badge } from '@/components/ui/badge'

import { CUSTOMER_FIELDS, CUSTOMER_FILTERS, type Customer } from '@/types/modules/customer'

import type {
  ColumnConfig,
  FilterFieldConfig,
} from '@/components/modules/components/data-list/type'

const FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: CUSTOMER_FILTERS.COMPANY_NAME,
    label: 'Company Name',
    type: 'text',
    placeholder: 'Search company…',
  },
  {
    key: CUSTOMER_FILTERS.COUNTRY,
    label: 'Country',
    type: 'text',
    placeholder: 'Filter by country…',
  },
]

const COLUMNS: ColumnConfig<Customer>[] = [
  {
    key: CUSTOMER_FIELDS.COMPANY_NAME,
    label: 'Company',
    render: (c) => <span className="font-semibold text-primary">{c.companyName}</span>,
  },
  {
    key: CUSTOMER_FIELDS.CONTACT_NAME,
    label: 'Contact',
    render: (c) => <span className="text-foreground">{c.contactName ?? '—'}</span>,
  },
  {
    key: CUSTOMER_FIELDS.CONTACT_TITLE,
    label: 'Title',
    render: (c) => <span className="text-muted-foreground text-xs">{c.contactTitle ?? '—'}</span>,
  },
  {
    key: CUSTOMER_FIELDS.COUNTRY,
    label: 'Country',
    render: (c) =>
      c.country ? (
        <Badge variant="secondary" className="font-normal">
          {c.country}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: CUSTOMER_FIELDS.CITY,
    label: 'City',
    render: (c) => <span className="text-muted-foreground">{c.city ?? '—'}</span>,
  },
  {
    key: CUSTOMER_FIELDS.PHONE,
    label: 'Phone',
    render: (c) => (
      <span className="text-muted-foreground text-xs font-mono">{c.phone ?? '—'}</span>
    ),
  },
]

export function CustomerList() {
  const navigate = useNavigate()
  const {
    filters,
    setFilter,
    reset,
    sortConfig,
    onSort,
    goToNext,
    goToPrev,
    customers,
    pageInfo,
    loading,
    error,
    refetch,
  } = useFilterCustomers()

  return (
    <section aria-label="Customers">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Customers</h1>

      <FilterBar fields={FILTER_FIELDS} values={filters} onChange={setFilter} onReset={reset} />

      {error && <ErrorMessage message={error.message} retry={refetch} />}

      <DataList
        columns={COLUMNS}
        rows={customers}
        loading={loading}
        emptyMessage="No customers found."
        onRowClick={(c) => navigate(`/customers/${c.id}`)}
        sortConfig={sortConfig}
        onSort={onSort}
        pageInfo={pageInfo}
        onNext={() => goToNext(pageInfo?.endCursor ?? null)}
        onPrev={() => goToPrev(pageInfo?.startCursor ?? null)}
      />
    </section>
  )
}
