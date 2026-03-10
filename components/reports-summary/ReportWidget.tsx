'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { FileDown, FileText, Printer, ExternalLink } from 'lucide-react'

export type ReportWidgetActionHandlers = {
  onExportExcel?: () => void
  onExportPdf?: () => void
  onPrint?: () => void
}

function IconAction({
  label,
  onClick,
  children
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-luxury btn-luxury-outline p-2.5 sm:p-2 inline-flex items-center justify-center"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

function IconLinkAction({
  label,
  href,
  children
}: {
  label: string
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="btn-luxury btn-luxury-outline p-2.5 sm:p-2 inline-flex items-center justify-center"
      aria-label={label}
      title={label}
    >
      {children}
    </Link>
  )
}

export default function ReportWidget({
  title,
  subtitle,
  icon: Icon,
  href,
  actions,
  children
}: {
  title: string
  subtitle?: string
  icon: LucideIcon
  href?: string
  actions?: ReportWidgetActionHandlers
  children: React.ReactNode
}) {
  return (
    <section className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50">
      <div className="flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-base sm:text-lg font-semibold text-charcoal dark:text-white flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
                <Icon className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </span>
              <span className="truncate">{title}</span>
            </h3>
            {subtitle ? (
              <p className="mt-1 text-xs sm:text-sm text-charcoal-soft dark:text-slate-400 font-stat">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 shrink-0 print:hidden">
            {href ? (
              <IconLinkAction label="مشاهده جزئیات" href={href}>
                <ExternalLink className="w-4 h-4" />
              </IconLinkAction>
            ) : null}
            {actions?.onExportExcel ? (
              <IconAction label="خروجی اکسل" onClick={actions.onExportExcel}>
                <FileDown className="w-4 h-4" />
              </IconAction>
            ) : null}
            {actions?.onExportPdf ? (
              <IconAction label="خروجی PDF" onClick={actions.onExportPdf}>
                <FileText className="w-4 h-4" />
              </IconAction>
            ) : null}
            {actions?.onPrint ? (
              <IconAction label="چاپ" onClick={actions.onPrint}>
                <Printer className="w-4 h-4" />
              </IconAction>
            ) : null}
          </div>
        </header>

        <div>{children}</div>
      </div>
    </section>
  )
}

