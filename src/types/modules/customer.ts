import type { PageInfo, SortDirection } from '../common'

export const CUSTOMER_FIELDS = {
  COMPANY_NAME: 'companyName',
  CONTACT_NAME: 'contactName',
  CONTACT_TITLE: 'contactTitle',
  ADDRESS: 'address',
  CITY: 'city',
  REGION: 'region',
  POSTAL_CODE: 'postalCode',
  COUNTRY: 'country',
  PHONE: 'phone',
  FAX: 'fax',
} as const
export type CustomerField = (typeof CUSTOMER_FIELDS)[keyof typeof CUSTOMER_FIELDS]

export const CUSTOMER_FILTERS = {
  COMPANY_NAME: 'companyName',
  COUNTRY: 'country',
} as const
export type CustomerFilter = (typeof CUSTOMER_FILTERS)[keyof typeof CUSTOMER_FILTERS]

export interface Customer {
  id: string
  companyName: string
  contactName: string | null
  contactTitle: string | null
  address: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  country: string | null
  phone: string | null
  fax: string | null
  orders: CustomerOrder[]
}

export interface CustomerOrder {
  id: string
  orderDate: string | null
  shippedDate: string | null
  freight: number | null
  shipName: string | null
}

export interface CustomersConnection {
  pageInfo: PageInfo
  nodes: Customer[]
}

export interface CustomerSortInput {
  companyName?: SortDirection
  contactName?: SortDirection
  country?: SortDirection
  city?: SortDirection
  phone?: SortDirection
}

export interface CustomerFilterInput {
  companyName?: { contains: string }
  country?: { contains: string }
  contactName?: { contains: string }
  city?: { contains: string }
}
