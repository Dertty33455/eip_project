export function formatXof(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

export function nowISO() {
  return new Date().toISOString()
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
