import { RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { FilterFieldConfig } from './type'

interface FilterBarProps<F extends Record<string, string>> {
  fields: FilterFieldConfig[]
  values: F
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export function FilterBar<F extends Record<string, string>>({
  fields,
  values,
  onChange,
  onReset,
}: FilterBarProps<F>) {
  return (
    <div className="rounded-xl border bg-card p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap gap-4 items-end">
        {fields.map((field) => (
          <div key={field.key} className="flex-1 min-w-[180px] space-y-1.5">
            <Label htmlFor={`filter-${field.key}`} className="text-xs font-medium">
              {field.label}
            </Label>
            <Input
              id={`filter-${field.key}`}
              type={field.type}
              value={values[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="h-9"
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-1.5 h-9 self-end"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </div>
  )
}
