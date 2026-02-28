import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MapPin, Briefcase, Package, DollarSign, FactoryIcon } from 'lucide-react'

import { Breadcrumb } from '@/components/common/Breadcrumb'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { CardSkeleton } from '@/components/common/CardSkeleton'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { GET_CUSTOMER_DETAIL, GET_CUSTOMER_ORDERS } from '@/graphql/queries/customers'
import { formatDate, formatCurrency } from '@/utils/formatters'

type OrderRow = {
  id: string
  orderDate?: string | null
  shippedDate?: string | null
  freight?: number | null
  shipName?: string | null
  shipCountry?: string | null
}

type CustomerProfile = {
  id: string
  companyName: string
  contactName?: string | null
  contactTitle?: string | null
  address?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  country?: string | null
  phone?: string | null
  fax?: string | null
}

type GetCustomerDetailData = { node: CustomerProfile | null }

type GetCustomerOrdersData = {
  orders: {
    pageInfo: { hasNextPage: boolean; endCursor?: string | null }
    nodes: OrderRow[]
  }
}

function decodeCustomerBusinessId(nodeId?: string) {
  if (!nodeId) return null
  try {
    const decoded = atob(nodeId)
    const [, businessId] = decoded.split(':')
    return businessId ?? null
  } catch {
    return null
  }
}

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const customerBusinessId = useMemo(() => decodeCustomerBusinessId(id), [id])

  const customerQuery = useQuery<GetCustomerDetailData>(GET_CUSTOMER_DETAIL, {
    variables: { id },
    skip: !id,
  })

  const ordersQuery = useQuery<GetCustomerOrdersData>(GET_CUSTOMER_ORDERS, {
    variables: { customerId: customerBusinessId as string, after: null },
    skip: !customerBusinessId,
    notifyOnNetworkStatusChange: true,
  })

  if (customerQuery.loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 bg-muted rounded w-48 animate-pulse" />
        <CardSkeleton />
      </div>
    )
  }

  if (customerQuery.error) {
    return (
      <ErrorMessage message={customerQuery.error.message} retry={() => customerQuery.refetch()} />
    )
  }

  const customer = customerQuery.data?.node
  if (!customer) return <ErrorMessage message="Customer not found." />

  const orders = ordersQuery.data?.orders.nodes ?? []
  const pageInfo = ordersQuery.data?.orders.pageInfo

  const totalOrders = orders.length
  const totalFreight = orders.reduce((sum, o) => sum + (o.freight ?? 0), 0)

  const loadMore = async () => {
    const cursor = pageInfo?.endCursor
    if (!cursor || !customerBusinessId) return
    await ordersQuery.fetchMore({
      variables: { customerId: customerBusinessId, after: cursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return {
          orders: {
            ...fetchMoreResult.orders,
            nodes: [...prev.orders.nodes, ...fetchMoreResult.orders.nodes],
          },
        }
      },
    })
  }

  return (
    <article className="space-y-6">
      <Breadcrumb
        crumbs={[{ label: 'Customers', to: '/customers' }, { label: customer.companyName }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{customer.companyName}</CardTitle>
            {customer.contactName && (
              <p className="text-sm text-primary font-medium">{customer.contactName}</p>
            )}
            {customer.contactTitle && (
              <Badge variant="secondary" className="w-fit text-xs font-normal">
                <Briefcase className="h-3 w-3 mr-1" />
                {customer.contactTitle}
              </Badge>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="pt-4 space-y-3">
            {customer.address && (
              <div className="flex gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-foreground">
                  {customer.address}
                  {customer.city && `, ${customer.city}`}
                  {customer.region && `, ${customer.region}`}
                  {customer.postalCode && ` ${customer.postalCode}`}
                  {customer.country && `, ${customer.country}`}
                </span>
              </div>
            )}
            {customer.phone && (
              <div className="flex gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-mono text-foreground">{customer.phone}</span>
              </div>
            )}
            {customer.fax && (
              <div className="flex gap-2 text-sm">
                <FactoryIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-mono text-muted-foreground">{customer.fax}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">{totalOrders}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalFreight)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Freight</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order history */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Order History</CardTitle>
          {ordersQuery.error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => ordersQuery.refetch()}
              className="text-destructive"
            >
              Retry orders
            </Button>
          )}
        </CardHeader>
        <Separator />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {['Order ID', 'Order Date', 'Shipped Date', 'Ship Name', 'Freight'].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersQuery.loading && orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Loading orders…
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <TableCell className="font-semibold text-primary font-mono">
                      #{order.id}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatDate(order.orderDate)}</TableCell>
                    <TableCell>
                      {order.shippedDate ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-normal"
                        >
                          {formatDate(order.shippedDate)}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-normal"
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.shipName ?? '—'}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(order.freight)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pageInfo?.hasNextPage && (
          <div className="p-4 border-t">
            <Button variant="outline" size="sm" onClick={loadMore} disabled={ordersQuery.loading}>
              {ordersQuery.loading ? 'Loading…' : 'Load more orders'}
            </Button>
          </div>
        )}
      </Card>

      <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Button>
    </article>
  )
}
