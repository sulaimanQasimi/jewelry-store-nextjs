'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import StatCard from '@/components/dashboard/StatCard'
import Loader from '@/components/ui/Loader'
import { BarChart3, TrendingUp, Gem } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TrendPoint {
  period: string
  total: number
  count: number
}

interface BestSellerRow {
  label: string
  quantity: number
  revenue: number
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } }
}

const formatNum = (n: number) => (n != null ? n.toLocaleString('fa-IR') : '0')
const formatPeriod = (p: string) => {
  if (p.length === 10) return new Date(p + 'T12:00:00').toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
  if (p.length === 7) return new Date(p + '-01').toLocaleDateString('fa-IR', { year: 'numeric', month: 'short' })
  return p
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day')
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  })
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10))
  const [trends, setTrends] = useState<TrendPoint[]>([])
  const [bestSellers, setBestSellers] = useState<BestSellerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrends = useCallback(async () => {
    try {
      const { data } = await axios.get<{ success?: boolean; data?: TrendPoint[] }>('/api/reports/sales-trends', {
        params: { period, dateFrom, dateTo }
      })
      setTrends(data?.data ?? [])
    } catch {
      setTrends([])
    }
  }, [period, dateFrom, dateTo])

  const fetchBestSellers = useCallback(async () => {
    try {
      const { data } = await axios.get<{ success?: boolean; data?: BestSellerRow[] }>('/api/reports/best-sellers', {
        params: { dateFrom, dateTo, limit: 10 }
      })
      setBestSellers(data?.data ?? [])
    } catch {
      setBestSellers([])
    }
  }, [dateFrom, dateTo])

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchTrends(), fetchBestSellers()]).finally(() => setLoading(false))
  }, [fetchTrends, fetchBestSellers])

  const periodTotal = trends.reduce((s, t) => s + t.total, 0)
  const topType = bestSellers[0]

  const trendChartData = {
    labels: trends.map((t) => formatPeriod(t.period)),
    datasets: [
      {
        label: 'فروش (افغانی)',
        data: trends.map((t) => t.total),
        backgroundColor: 'rgba(198, 167, 94, 0.5)',
        borderColor: 'rgb(180, 140, 60)',
        borderWidth: 1,
        fill: true
      }
    ]
  }

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">تحلیل فروش</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-stat">
            روند فروش و پرفروش‌ترین انواع
          </p>
        </div>
        <Link
          href="/report"
          className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-stat"
        >
          بازگشت به گزارشات
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">بازه:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
            className="input-luxury w-auto min-w-[100px]"
          >
            <option value="day">روز</option>
            <option value="week">هفته</option>
            <option value="month">ماه</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">از</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input-luxury w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">تا</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input-luxury w-auto"
          />
        </div>
      </div>

      {loading ? (
        <Loader message="در حال بارگذاری…" className="min-h-[300px]" />
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              label="مجموع فروش دوره"
              value={formatNum(periodTotal)}
              sub="افغانی"
              icon={TrendingUp}
              variant="gold"
              href="/report"
            />
            <StatCard
              label="پرفروش‌ترین نوع"
              value={topType ? topType.label : '—'}
              sub={topType ? `${formatNum(topType.quantity)} عدد` : ''}
              icon={Gem}
              variant="emerald"
              href="/report"
            />
          </section>

          <section className="card-luxury p-6 rounded-xl border border-amber-200/50 dark:border-slate-600/50">
            <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-600" />
              روند فروش
            </h2>
            <div className="h-64">
              {trends.length > 0 ? (
                <Line
                  data={trendChartData}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: { ...chartOptions.scales.y, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                  داده‌ای برای این بازه وجود ندارد
                </div>
              )}
            </div>
          </section>

          <section className="card-luxury p-6 rounded-xl border border-amber-200/50 dark:border-slate-600/50">
            <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
              <Gem className="h-5 w-5 text-amber-600" />
              پرفروش‌ترین انواع (بر اساس مبلغ)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200/60 dark:border-slate-600">
                    <th className="text-right py-3 px-2 font-medium text-slate-600 dark:text-slate-400">نوع</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-600 dark:text-slate-400">تعداد فروش</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-600 dark:text-slate-400">مجموع مبلغ (افغانی)</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500 dark:text-slate-400">
                        داده‌ای یافت نشد
                      </td>
                    </tr>
                  ) : (
                    bestSellers.map((row) => (
                      <tr key={row.label} className="border-b border-amber-100 dark:border-slate-700/50">
                        <td className="py-2 px-2 font-medium text-charcoal dark:text-white">{row.label}</td>
                        <td className="py-2 px-2 font-stat">{formatNum(row.quantity)}</td>
                        <td className="py-2 px-2 font-stat">{formatNum(row.revenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
