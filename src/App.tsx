import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'

import { Layout } from '@/components/layouts/Layout'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

import { client } from '@/graphql/client'
import { routes } from '@/routes/config'

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              {routes.map(({ key, ...route }) => (
                <Route key={key} {...route} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ApolloProvider>
  )
}
