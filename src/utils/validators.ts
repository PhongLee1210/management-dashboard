export function isNonEmpty(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}
