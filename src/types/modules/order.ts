import type { SortDirection } from '../common'

export const ORDER_FIELDS = {
  ORDER_ID: 'orderId',
  ORDER_DATE: 'orderDate',
  CUSTOMER: 'customer',
  SHIPPED_DATE: 'shippedDate',
  FREIGHT: 'freight',
  SHIP_NAME: 'shipName',
} as const
export type OrderField = (typeof ORDER_FIELDS)[keyof typeof ORDER_FIELDS]

export const ORDER_FILTERS = {
  CUSTOMER: 'customer',
  DATE_FROM: 'dateFrom',
  DATE_TO: 'dateTo',
} as const
export type OrderFilter = (typeof ORDER_FILTERS)[keyof typeof ORDER_FILTERS]

export interface Order {
  id: string
  customerId: string | null
  employeeId: number | null
  orderDate: string | null
  requiredDate: string | null
  shippedDate: string | null
  shipVia: number | null
  freight: number | null
  shipName: string | null
  shipAddress: string | null
  shipCity: string | null
  shipRegion: string | null
  shipPostalCode: string | null
  shipCountry: string | null
  customer: OrderCustomer | null
  employee: OrderEmployee | null
  orderDetails: OrderDetail[]
}

export interface OrderCustomer {
  id: string
  companyName: string
}

export interface OrderEmployee {
  id: string
  firstName: string
  lastName: string
}

export interface OrderDetail {
  unitPrice: number
  quantity: number
  discount: number
  product: OrderProduct | null
}

export interface OrderProduct {
  id: string
  productName: string
}

export interface OrdersConnection {
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string | null
    endCursor: string | null
  }
  nodes: Order[]
}

export interface OrderSortInput {
  orderDate?: SortDirection
  freight?: SortDirection
  shippedDate?: SortDirection
  orderId?: SortDirection
  customer?: { companyName?: SortDirection }
}

export interface OrderFilterInput {
  customer?: { companyName?: { contains: string } }
  orderDate?: { gte?: string; lte?: string }
}
