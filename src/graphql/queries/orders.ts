import type { OrdersConnection, OrderSortInput } from '@/types/modules/order'
import { gql, type TypedDocumentNode } from '@apollo/client'

export const ORDER_LIST_FIELDS = gql`
  fragment OrderListFields on OrdersConnection {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      id
      orderDate
      customer {
        companyName
      }
    }
  }
`

type OrdersData = { orders: OrdersConnection }

type BaseVars = {
  first?: number
  after?: string | null
  last?: number
  before?: string | null
  order?: OrderSortInput[]
}

export const GET_ORDERS_NO_FILTER: TypedDocumentNode<OrdersData, BaseVars> = gql`
  ${ORDER_LIST_FIELDS}
  query GetOrdersNoFilter(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [OrderSortInput!]
  ) {
    orders(first: $first, after: $after, last: $last, before: $before, order: $order) {
      ...OrderListFields
    }
  }
`

export const GET_ORDERS_CUSTOMER: TypedDocumentNode<
  OrdersData,
  BaseVars & { customerName: string }
> = gql`
  ${ORDER_LIST_FIELDS}
  query GetOrdersCustomer(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [OrderSortInput!]
    $customerName: String!
  ) {
    orders(
      first: $first
      after: $after
      last: $last
      before: $before
      order: $order
      where: { customer: { companyName: { contains: $customerName } } }
    ) {
      ...OrderListFields
    }
  }
`

export const GET_ORDERS_DATE_RANGE: TypedDocumentNode<
  OrdersData,
  BaseVars & { dateFrom: string; dateTo: string }
> = gql`
  ${ORDER_LIST_FIELDS}
  query GetOrdersDateRange(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [OrderSortInput!]
    $dateFrom: LocalDate!
    $dateTo: LocalDate!
  ) {
    orders(
      first: $first
      after: $after
      last: $last
      before: $before
      order: $order
      where: { orderDate: { gte: $dateFrom, lte: $dateTo } }
    ) {
      ...OrderListFields
    }
  }
`

export const GET_ORDERS_CUSTOMER_DATE_RANGE: TypedDocumentNode<
  OrdersData,
  BaseVars & { customerName: string; dateFrom: string; dateTo: string }
> = gql`
  ${ORDER_LIST_FIELDS}
  query GetOrdersCustomerDateRange(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [OrderSortInput!]
    $customerName: String!
    $dateFrom: LocalDate!
    $dateTo: LocalDate!
  ) {
    orders(
      first: $first
      after: $after
      last: $last
      before: $before
      order: $order
      where: {
        customer: { companyName: { contains: $customerName } }
        orderDate: { gte: $dateFrom, lte: $dateTo }
      }
    ) {
      ...OrderListFields
    }
  }
`
