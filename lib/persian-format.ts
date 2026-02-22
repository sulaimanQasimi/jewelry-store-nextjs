/**
 * Persian (Farsi/Dari) number and currency formatting for the storefront.
 */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

/** Convert ASCII digits to Persian (Eastern Arabic) numerals */
export function toPersianDigits(value: number | string): string {
  const str = String(value)
  return str.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)])
}

/** Format price for display: Persian numerals + افغانی */
export function formatPriceAfn(value: number | null | undefined): string {
  if (value == null || isNaN(Number(value))) return '—'
  const num = Math.round(Number(value))
  const withCommas = num.toLocaleString('en-US') // e.g. 1,234,567
  const persian = withCommas.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)])
  return `${persian} افغانی`
}
