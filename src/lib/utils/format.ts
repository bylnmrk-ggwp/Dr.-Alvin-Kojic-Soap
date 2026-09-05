const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** Money is stored and passed around in centavos; format only at the edge. */
export function formatPrice(centavos: number): string {
  const amount = centavos / 100
  return peso.format(amount).replace(/\.00$/, '')
}

export function formatCompactCount(value: number): string {
  return new Intl.NumberFormat('en-PH', { notation: 'compact' }).format(value)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}
