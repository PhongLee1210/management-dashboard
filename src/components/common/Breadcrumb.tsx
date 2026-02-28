import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CrumbItem {
  label: string
  to?: string
}

export function Breadcrumb({ crumbs }: { crumbs: CrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <li>
          <Link to="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            {crumb.to ? (
              <Link
                to={crumb.to}
                className={cn(
                  'hover:text-foreground transition-colors',
                  i < crumbs.length - 1 ? '' : 'text-foreground font-medium'
                )}
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
