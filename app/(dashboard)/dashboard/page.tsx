'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import {
  TrendingUp,
  Wallet,
  Gem,
  User,
  ShoppingBag,
  Receipt,
  CreditCard,
  Handshake,
  BarChart3,
  Wrench
} from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import GoldRatesCard from '@/components/dashboard/GoldRatesCard'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface DashboardStats {
  productsTotal: number
  productsSold: number
  productsAvailable: number
  customersCount: number
  suppliersCount: number
  transactionsCount: number
  purchasesCount: number
  expensesTotal: number
  loanReportsCount: number
  loanReportsTotal: number
  todaySales: number
  todayPaid: number
  todayRemaining: number
  todayTransactions: number
}

interface DayData {
  date: string
  total: number
  count: number
}

interface TypeData {
  label: string
  value: number
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true }
  }
}

const formatNum = (n: number) => (n != null ? n.toLocaleString('fa-IR') : '0')
const formatDate = (d: string) => {
  const dt = new Date(d)
  return dt.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [last7Days, setLast7Days] = useState<DayData[]>([])
  const [salesByType, setSalesByType] = useState<TypeData[]>([])
  const [latestGold, setLatestGold] = useState<{ date: string; price_per_gram_afn: number | null; price_per_ounce_usd?: number } | null>(null)
  const [repairsReceivedCount, setRepairsReceivedCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<{ success?: boolean; stats?: DashboardStats; last7Days?: DayData[]; salesByType?: TypeData[] }>('/api/dashboard/stats')
      .then(({ data }) => {
        if (data.success) {
          setStats(data.stats ?? null)
          setLast7Days(data.last7Days ?? [])
          setSalesByType(data.salesByType ?? [])
        } else setError('خطا در بارگذاری')
      })
      .catch(() => setError('خطا در بارگذاری'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    axios.get<{ success?: boolean; data?: { date: string; price_per_gram_afn: number | null; price_per_ounce_usd?: number } | null }>('/api/gold-rate/latest').then(({ data }) => {
      if (data?.success && data?.data) setLatestGold(data.data)
      else setLatestGold(null)
    }).catch(() => setLatestGold(null))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="card-luxury p-8 text-center text-charcoal-soft">
        {error ?? 'دیتا یافت نشد'}
      </div>
    )
  }

  const salesChartData = {
    labels: last7Days.map((d) => formatDate(d.date)),
    datasets: [
      {
        label: 'فروش (افغانی)',
        data: last7Days.map((d) => d.total),
        backgroundColor: 'rgba(198, 167, 94, 0.5)',
        borderColor: 'rgb(180, 140, 60)',
        borderWidth: 1,
        fill: true
      }
    ]
  }

  const typeChartData = {
    labels: salesByType.map((t) => t.label),
    datasets: [
      {
        data: salesByType.map((t) => t.value),
        backgroundColor: [
          'rgba(198, 167, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const statCards = [
    {
      label: 'فروش امروز',
      value: formatNum(stats.todaySales),
      sub: `${stats.todayTransactions} تراکنش`,
      icon: TrendingUp,
      variant: 'emerald' as const,
      href: '/daily-report'
    },
    {
      label: 'باقی‌مانده امروز',
      value: formatNum(stats.todayRemaining),
      sub: 'افغانی',
      icon: Wallet,
      variant: 'gold' as const,
      href: '/loan-management'
    },
    {
      label: 'اجناس موجود',
      value: formatNum(stats.productsAvailable),
      sub: `از ${formatNum(stats.productsTotal)} کل`,
      icon: Gem,
      variant: 'gold' as const,
      href: '/products'
    },
    {
      label: 'مشتریان',
      value: formatNum(stats.customersCount),
      sub: '',
      icon: User,
      variant: 'neutral' as const,
      href: '/customer-registration'
    },
    {
      label: 'خریدها',
      value: formatNum(stats.purchasesCount),
      sub: '',
      icon: ShoppingBag,
      variant: 'gold' as const,
      href: '/purchases'
    },
    {
      label: 'مصارف',
      value: formatNum(stats.expensesTotal),
      sub: 'افغانی',
      icon: Receipt,
      variant: 'ruby' as const,
      href: '/expenses'
    },
    {
      label: 'وام‌های باز',
      value: formatNum(stats.loanReportsTotal),
      sub: `${stats.loanReportsCount} گزارش`,
      icon: CreditCard,
      variant: 'neutral' as const,
      href: '/loan-management'
    },
    {
      label: 'تمویل‌کنندگان',
      value: formatNum(stats.suppliersCount),
      sub: '',
      icon: Handshake,
      variant: 'neutral' as const,
      href: '/suppliers'
    }
  ]

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">داشبورد</h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">خلاصه وضعیت فروشگاه</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="max-w-sm">
          <GoldRatesCard
            pricePerGramAfn={latestGold?.price_per_gram_afn ?? null}
            date={latestGold?.date ?? null}
            pricePerOunceUsd={latestGold?.price_per_ounce_usd ?? null}
            href="/gold-rate"
          />
        </div>
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            sub={card.sub || undefined}
            icon={card.icon}
            variant={card.variant}
            href={card.href}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-luxury p-6 rounded-xl border border-gold-200/50 dark:border-slate-600/50">
          <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold-600" />
            فروش ۷ روز اخیر
          </h2>
          <div className="h-64">
            <Bar data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card-luxury p-6 rounded-xl border border-gold-200/50 dark:border-slate-600/50">
          <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
            <Gem className="h-5 w-5 text-gold-600" />
            فروش بر اساس نوع
          </h2>
          <div className="h-64">
            {salesByType.length > 0 ? (
              <Doughnut
                data={typeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-charcoal-soft text-sm">
                داده‌ای موجود نیست
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="card-luxury p-6 rounded-xl border border-gold-200/50 dark:border-slate-600/50">
        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold-600" />
          روند فروش (۷ روز)
        </h2>
        <div className="h-56">
          <Line
            data={salesChartData}
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: { ...chartOptions.scales.y, grid: { color: 'rgba(0,0,0,0.05)' } }
              }
            }}
          />
        </div>
      </section>
    </div>
  )
}
