export function toFileDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}_${m}_${day}`
}

export function safeSlug(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'report'
}

export function buildExportFilename(base: string, ext: 'xlsx' | 'pdf', date?: Date): string {
  const stamp = toFileDate(date || new Date())
  return `${safeSlug(base)}_${stamp}.${ext}`
}

