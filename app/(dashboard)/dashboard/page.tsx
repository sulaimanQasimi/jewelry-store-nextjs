'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  TrendingUp,
  Wallet,
  Receipt,
  BarChart3,
  Gem
} from 'lucide-react'
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
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      href: '/daily-report'
    },
    {
      label: 'باقی‌مانده امروز',
      value: formatNum(stats.todayRemaining),
      sub: 'افغانی',
      icon: Wallet,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      href: '/loan-management'
    },
    {
      label: 'اجناس موجود',
      value: formatNum(stats.productsAvailable),
      sub: `از ${formatNum(stats.productsTotal)} کل`,
      icon: Package,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      href: '/products'
    },
    {
      label: 'مشتریان',
      value: formatNum(stats.customersCount),
      sub: '',
      icon: Users,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      href: '/customer-registration'
    },
    {
      label: 'وام‌های باز',
      value: formatNum(stats.loanReportsTotal),
      sub: `${stats.loanReportsCount} گزارش`,
      icon: CreditCard,
      color: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      href: '/loan-management'
    },
    {
      label: 'خریدها',
      value: formatNum(stats.purchasesCount),
      sub: '',
      icon: ShoppingCart,
      color: 'from-cyan-500 to-teal-600',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      href: '/purchases'
    },
    {
      label: 'مصارف',
      value: formatNum(stats.expensesTotal),
      sub: 'افغانی',
      icon: Receipt,
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-50 dark:bg-red-900/20',
      href: '/expenses'
    },
    {
      label: 'تمویل‌کنندگان',
      value: formatNum(stats.suppliersCount),
      sub: '',
      icon: Users,
      color: 'from-teal-500 to-emerald-600',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      href: '/suppliers'
    }
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">داشبورد</h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">خلاصه وضعیت فروشگاه</p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`card-luxury p-5 rounded-xl border border-gold-200/50 dark:border-slate-600/50 hover:shadow-lg hover:border-gold-300 dark:hover:border-gold-500/50 transition-all group ${card.bg}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft dark:text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold text-charcoal dark:text-white mt-1">{card.value}</p>
                {card.sub && (
                  <p className="text-xs text-charcoal-soft dark:text-slate-500 mt-0.5">{card.sub}</p>
                )}
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
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
