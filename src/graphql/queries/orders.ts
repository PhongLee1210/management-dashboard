import type { OrdersConnection, OrderSortInput } from '@/types/modules/order'
import { gql } from '@apollo/client'

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

export type OrdersData = { orders: OrdersConnection }

type BaseVars = {
  first?: number
  after?: string | null
  last?: number
  before?: string | null
  order?: OrderSortInput[]
}

export type OrdersFilterVars = BaseVars & {
  customerName?: string
  dateFrom?: string
  dateTo?: string
}

type OrdersFilterArgs = {
  customerName?: string
  dateFrom?: string | null
  dateTo?: string | null
}

export function createOrdersQueryDocument(filters: OrdersFilterArgs) {
  const extraVariables: string[] = []
  const whereFields: string[] = []

  if (!!filters.customerName?.trim()) {
    extraVariables.push(`$customerName: String!`)
    whereFields.push(`customer: { companyName: { contains: $customerName } }`)
  }

  if (!!filters.dateFrom && !!filters.dateTo) {
    extraVariables.push(`$dateFrom: LocalDate!`, `$dateTo: LocalDate!`)
    whereFields.push(`orderDate: { gte: $dateFrom, lte: $dateTo }`)
  }

  const whereBlock =
    whereFields.length > 0
      ? `
        where: {
          ${whereFields.join('\n')}
        }
      `
      : ''

  return gql`
    ${ORDER_LIST_FIELDS}
    query GetOrders(
      $first: Int
      $after: String
      $last: Int
      $before: String
      $order: [OrderSortInput!]
      ${extraVariables.join('\n')}
    ) {
      orders(
        first: $first
        after: $after
        last: $last
        before: $before
        order: $order
        ${whereBlock}
      ) {
        ...OrderListFields
      }
    }
  `
}

export const GET_ORDER = gql`
  query GetOrderHeader($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        orderDate
        requiredDate
        shippedDate
        freight
        shipName
        shipAddress
        shipCity
        shipRegion
        shipPostalCode
        shipCountry
        customer {
          id
          companyName
        }
        employee {
          id
          firstName
          lastName
        }
      }
    }
  }
`

export const GET_ORDER_ITEMS = gql`
  query GetOrderItems($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        orderDetails {
          unitPrice
          quantity
          discount
          product {
            id
            productName
          }
        }
      }
    }
  }
`
