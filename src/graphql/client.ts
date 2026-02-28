import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: '/graphql',
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          customers: {
            keyArgs: ['where', 'order'],
            merge(_existing, incoming) {
              return incoming
            },
          },
          orders: {
            keyArgs: ['where', 'order'],
            merge(_existing, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
  enhancedClientAwareness: { transport: false },
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
})
