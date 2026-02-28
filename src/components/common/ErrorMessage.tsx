import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorMessageProps {
  message: string
  retry?: () => void
}

export function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="my-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="shrink-0">
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
