export const SortDirection = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection]

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}
