'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

// ─── Types ───────────────────────────────────────────────────
export interface CohortData {
  cohort_week: string
  cohort_label?: string
  total_users: number | null
  activated_users: number | null
  activation_rate: number | null
  pmf_reached: boolean | null
}

interface CohortTableProps {
  data: CohortData[]
}

// ─── Helpers ─────────────────────────────────────────────────
function getActivationColor(rate: number | null): string {
  if (rate === null) return 'bg-gray-100 text-gray-400'
  if (rate >= 75) return 'bg-emerald-500/20 text-emerald-700'
  if (rate >= 50) return 'bg-amber-500/20 text-amber-700'
  return 'bg-red-500/20 text-red-700'
}

function getActivationBarColor(rate: number | null): string {
  if (rate === null) return 'bg-gray-200'
  if (rate >= 75) return 'bg-emerald-500'
  if (rate >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function getPmfBadge(pmfReached: boolean | null) {
  if (pmfReached === null) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        —
      </span>
    )
  }
  if (pmfReached) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        PMF atteint
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Non atteint
    </span>
  )
}

function formatWeekLabel(week: string): string {
  // Handle "2026-W10" format
  if (week.includes('-W')) {
    const parts = week.split('-W')
    return `S${parts[1]}`
  }
  // Handle ISO date "2026-03-02" format
  try {
    const date = new Date(week)
    const day = date.getDate()
    const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
    const month = months[date.getMonth()]
    return `${day} ${month}`
  } catch {
    return week
  }
}

// ─── Tooltip ─────────────────────────────────────────────────
function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode
  content: React.ReactNode
}) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setPosition({ x: rect.left + rect.width / 2, y: rect.top })
    setShow(true)
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: position.x, top: position.y - 8 }}
        >
          <div className="relative -translate-x-1/2 -translate-y-full">
            <div className="bg-earth-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
              {content}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-earth-800" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────
export default function CohortTable({ data }: CohortTableProps) {
  // Sort chronologically
  const sorted = [...data].sort((a, b) => a.cohort_week.localeCompare(b.cohort_week))

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.04, duration: 0.3 },
    }),
  }

  return (
    <div className="w-full">
      {/* PMF Target Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-200" />
          <span>&lt; 50%</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-200" />
          <span>50-74%</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-200" />
          <span>≥ 75% (PMF)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
          <span>N/A</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 bg-gray-50/70">
                Cohorte
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 bg-gray-50/70">
                Utilisateurs
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 bg-gray-50/70 min-w-[200px]">
                Activation 7j
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 bg-gray-50/70">
                Statut PMF
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((cohort, index) => (
              <motion.tr
                key={cohort.cohort_week}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="group hover:bg-primary-50/30 transition-colors duration-200"
              >
                {/* Cohort Week */}
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {cohort.cohort_label || formatWeekLabel(cohort.cohort_week)}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {cohort.cohort_week}
                    </span>
                  </div>
                </td>

                {/* Total Users */}
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-gray-700">
                    {cohort.total_users !== null ? cohort.total_users : '—'}
                  </span>
                </td>

                {/* Activation Rate (heatmap cell) */}
                <td className="px-5 py-4">
                  <Tooltip
                    content={
                      <div className="space-y-1">
                        <div className="font-semibold border-b border-white/20 pb-1 mb-1">
                          {cohort.cohort_label || cohort.cohort_week}
                        </div>
                        <div>Total : {cohort.total_users ?? '—'} utilisateurs</div>
                        <div>Activés : {cohort.activated_users ?? '—'} utilisateurs</div>
                        <div>Taux : {cohort.activation_rate !== null ? `${cohort.activation_rate.toFixed(1)}%` : '—'}</div>
                        <div className="pt-1 border-t border-white/20">
                          Objectif PMF : 75%
                        </div>
                      </div>
                    }
                  >
                    <div className="flex items-center gap-3">
                      {/* Rate badge */}
                      <div
                        className={`
                          flex-shrink-0 w-16 py-1.5 rounded-md text-center text-xs font-bold
                          transition-all duration-500
                          ${getActivationColor(cohort.activation_rate)}
                        `}
                      >
                        {cohort.activation_rate !== null
                          ? `${cohort.activation_rate.toFixed(1)}%`
                          : '—'}
                      </div>

                      {/* Progress bar */}
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${getActivationBarColor(cohort.activation_rate)}`}
                          style={{
                            width: cohort.activation_rate !== null
                              ? `${Math.min(cohort.activation_rate, 100)}%`
                              : '0%',
                          }}
                        />
                      </div>

                      {/* 75% marker */}
                      <div className="relative flex-shrink-0 w-0 -ml-[27%]">
                        <div className="absolute -top-1 w-px h-4 bg-gray-300" title="Objectif 75%" />
                      </div>
                    </div>
                  </Tooltip>
                </td>

                {/* PMF Status */}
                <td className="px-5 py-4 text-center">
                  {getPmfBadge(cohort.pmf_reached)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
