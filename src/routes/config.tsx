import { lazy, type ReactElement } from 'react'

import { Home } from '../pages/Home'

const CustomerList = lazy(() =>
  import('../components/modules/customers/CustomerList').then((m) => ({ default: m.CustomerList }))
)
const CustomerDetail = lazy(() =>
  import('../components/modules/customers/CustomerDetail').then((m) => ({
    default: m.CustomerDetail,
  }))
)
const OrderList = lazy(() =>
  import('../components/modules/orders/OrderList').then((m) => ({ default: m.OrderList }))
)
const OrderDetail = lazy(() =>
  import('../components/modules/orders/OrderDetail').then((m) => ({ default: m.OrderDetail }))
)

type IndexRoute = {
  key: string
  index: true
  label?: string
  element: ReactElement
}

type PathRoute = {
  key: string
  path: string
  label?: string
  element: ReactElement
}

export type RouteConfig = IndexRoute | PathRoute

export const routes: RouteConfig[] = [
  { key: 'home', index: true, element: <Home /> },
  { key: 'customers', path: 'customers', label: 'Customers', element: <CustomerList /> },
  { key: 'customer-detail', path: 'customers/:id', element: <CustomerDetail /> },
  { key: 'orders', path: 'orders', label: 'Orders', element: <OrderList /> },
  { key: 'order-detail', path: 'orders/:id', element: <OrderDetail /> },
]
