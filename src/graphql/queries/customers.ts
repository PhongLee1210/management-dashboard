import { gql } from '@apollo/client'

const CUSTOMER_LIST_FIELDS = gql`
  fragment CustomerListFields on CustomersConnection {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      id
      companyName
      contactName
      contactTitle
      city
      country
      phone
    }
  }
`

export const GET_CUSTOMERS = gql`
  ${CUSTOMER_LIST_FIELDS}
  query GetCustomers(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [CustomerSortInput!]
    $companyName: String
    $country: String
  ) {
    customers(
      first: $first
      after: $after
      last: $last
      before: $before
      order: $order
      where: { companyName: { contains: $companyName }, country: { contains: $country } }
    ) {
      ...CustomerListFields
    }
  }
`

export const GET_CUSTOMER_DETAIL = gql`
  query GetCustomerDetail($id: ID!) {
    node(id: $id) {
      ... on Customer {
        id
        companyName
        contactName
        contactTitle
        address
        city
        region
        postalCode
        country
        phone
        fax
      }
    }
  }
`

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($customerId: String!, $after: String) {
    orders(
      first: 10
      after: $after
      where: { customerId: { eq: $customerId } }
      order: [{ orderDate: DESC }]
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        orderDate
        shippedDate
        freight
        shipName
        shipCountry
      }
    }
  }
`
