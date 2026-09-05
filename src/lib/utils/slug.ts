export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function orderReference(seed = Date.now()): string {
  const block = seed.toString(36).toUpperCase().slice(-6)
  return `DA-${block}`
}
