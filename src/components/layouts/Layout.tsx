import { Outlet } from 'react-router-dom'
import { Sidebar, MobileSidebar } from './Navigation'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <MobileSidebar />
          <span className="font-semibold text-primary">Management</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
