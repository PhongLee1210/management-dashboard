import { useQuery } from '@apollo/client/react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Truck, CalendarDays, User2, Package } from 'lucide-react'

import { Breadcrumb } from '@/components/common/Breadcrumb'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { CardSkeleton } from '@/components/common/CardSkeleton'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { formatCurrency, formatDate } from '@/utils/formatters'
import { GET_ORDER, GET_ORDER_ITEMS } from '@/graphql/queries/orders'

type OrderHeader = {
  id: string
  orderDate?: string | null
  requiredDate?: string | null
  shippedDate?: string | null
  freight?: number | null
  shipName?: string | null
  shipAddress?: string | null
  shipCity?: string | null
  shipRegion?: string | null
  shipPostalCode?: string | null
  shipCountry?: string | null
  customer?: { id: string; companyName: string } | null
  employee?: { id: string; firstName: string; lastName: string } | null
}

type OrderItem = {
  unitPrice: number
  quantity: number
  discount: number
  product?: { id: string; productName: string } | null
}

type OrderItemsNode = {
  id: string
  orderDetails: OrderItem[]
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const headerQuery = useQuery<{ node: OrderHeader | null }>(GET_ORDER, {
    variables: { id },
    skip: !id,
  })

  const itemsQuery = useQuery<{ node: OrderItemsNode | null }>(GET_ORDER_ITEMS, {
    variables: { id },
    skip: !id,
  })

  const loading = headerQuery.loading || itemsQuery.loading
  const error = headerQuery.error ?? itemsQuery.error

  const retry = () => {
    headerQuery.refetch()
    itemsQuery.refetch()
  }

  if (loading && !headerQuery.data && !itemsQuery.data) {
    return (
      <div className="space-y-4">
        <div className="h-5 bg-muted rounded w-48 animate-pulse" />
        <CardSkeleton />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} retry={retry} />
  }

  const order = headerQuery.data?.node
  if (!order) return <ErrorMessage message="Order not found." />

  const isShipped = Boolean(order.shippedDate)

  return (
    <article className="space-y-6">
      <Breadcrumb crumbs={[{ label: 'Orders', to: '/orders' }, { label: `Order #${order.id}` }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-xl">Order #{order.id}</CardTitle>
              <Badge
                variant="default"
                className={
                  isShipped
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                }
              >
                {isShipped ? 'Shipped' : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <dl className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> Order Date
                </dt>
                <dd className="font-medium tabular-nums">{formatDate(order.orderDate)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> Required Date
                </dt>
                <dd className="font-medium tabular-nums">{formatDate(order.requiredDate)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" /> Shipped Date
                </dt>
                <dd className="font-medium tabular-nums">
                  {order.shippedDate ? (
                    <span className="text-emerald-700">{formatDate(order.shippedDate)}</span>
                  ) : (
                    <span className="text-amber-600">Pending</span>
                  )}
                </dd>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Freight</dt>
                <dd className="font-semibold tabular-nums">{formatCurrency(order.freight)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Customer & shipping */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Customer & Shipping</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <dl className="space-y-3">
              {order.customer && (
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <User2 className="h-3 w-3" /> Customer
                  </dt>
                  <dd>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-sm font-medium"
                      onClick={() => navigate(`/customers/${order.customer!.id}`)}
                    >
                      {order.customer.companyName}
                    </Button>
                  </dd>
                </div>
              )}
              {order.employee && (
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Employee
                  </dt>
                  <dd className="text-sm font-medium">
                    {order.employee.firstName} {order.employee.lastName}
                  </dd>
                </div>
              )}
              {order.shipName && (
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Package className="h-3 w-3" /> Ship To
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    {order.shipName}
                    {order.shipAddress && <span>, {order.shipAddress}</span>}
                    {order.shipCity && <span>, {order.shipCity}</span>}
                    {order.shipRegion && <span>, {order.shipRegion}</span>}
                    {order.shipPostalCode && <span> {order.shipPostalCode}</span>}
                    {order.shipCountry && <span>, {order.shipCountry}</span>}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Button>
    </article>
  )
}
