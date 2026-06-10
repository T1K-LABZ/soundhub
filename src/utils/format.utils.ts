export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat('en-US').format(new Date(value))
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
