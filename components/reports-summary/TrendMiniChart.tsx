'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function TrendMiniChart({
  title,
  points,
  color = 'rgb(180, 140, 60)',
  fill = 'rgba(198, 167, 94, 0.25)'
}: {
  title: string
  points: { period: string; totalAfn: number }[]
  color?: string
  fill?: string
}) {
  const labels = points.map((p) => p.period.slice(5))
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: points.map((p) => p.totalAfn),
        borderColor: color,
        backgroundColor: fill,
        fill: true,
        tension: 0.35,
        pointRadius: 0
      }
    ]
  }

  return (
    <div className="h-24 sm:h-28">
      {points.length > 0 ? (
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: { x: { display: false }, y: { display: false } }
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
          No data
        </div>
      )}
    </div>
  )
}

