'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

// ─── Types ───────────────────────────────────────────────────
export interface CohortWeek {
  relative_week: number
  activation_rate: number | null
  activated_users: number | null
}

export interface CohortData {
  cohort_week: string
  cohort_label: string
  total_users: number
  weeks: CohortWeek[]
}

interface CohortTableProps {
  data: CohortData[]
}

// ─── Helpers ─────────────────────────────────────────────────
function getCellColor(rate: number | null): {
  bg: string
  text: string
} {
  if (rate === null) return { bg: 'bg-gray-50', text: 'text-gray-300' }
  if (rate >= 75) return { bg: 'bg-emerald-500', text: 'text-white' }
  if (rate >= 60) return { bg: 'bg-yellow-400', text: 'text-gray-900' }
  if (rate >= 45) return { bg: 'bg-orange-400', text: 'text-white' }
  return { bg: 'bg-red-500', text: 'text-white' }
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

  // Calculate max week to determine column count
  const maxWeek = Math.max(...sorted.flatMap((c) => c.weeks.map((w) => w.relative_week)))

  const weeks = Array.from({ length: maxWeek + 1 }, (_, i) => i)

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.02, duration: 0.3 },
    }),
  }

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className="text-xs font-medium text-gray-600">≥ 75% (PMF)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400" />
          <span className="text-xs font-medium text-gray-600">60-74%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-400" />
          <span className="text-xs font-medium text-gray-600">45-59%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-xs font-medium text-gray-600">&lt; 45%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200" />
          <span className="text-xs font-medium text-gray-600">N/A</span>
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 min-w-[140px]">
                Cohorte
              </th>
              <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 py-3 min-w-[60px]">
                Utilisateurs
              </th>
              {weeks.map((week) => (
                <th
                  key={week}
                  className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 py-3 min-w-[50px]"
                >
                  W{week}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((cohort, rowIdx) => (
              <tr key={cohort.cohort_week} className="hover:bg-gray-50/50 transition-colors">
                {/* Cohort label */}
                <td className="px-4 py-3 text-left">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {cohort.cohort_label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {cohort.cohort_week}
                    </span>
                  </div>
                </td>

                {/* Total users */}
                <td className="px-2 py-3 text-center">
                  <span className="text-sm font-medium text-gray-700">
                    {cohort.total_users}
                  </span>
                </td>

                {/* Heatmap cells */}
                {weeks.map((week, colIdx) => {
                  const weekData = cohort.weeks.find((w) => w.relative_week === week)
                  const rate = weekData?.activation_rate
                  const colors = getCellColor(rate)

                  return (
                    <td key={week} className="px-2 py-3 text-center">
                      {rate !== null && rate !== undefined ? (
                        <Tooltip
                          content={
                            <div className="space-y-1">
                              <div className="font-semibold border-b border-white/20 pb-1 mb-1">
                                {cohort.cohort_label} • Week {week}
                              </div>
                              <div>Taux : {rate.toFixed(1)}%</div>
                              <div>
                                Utilisateurs : {weekData?.activated_users ?? '—'} /
                                {cohort.total_users}
                              </div>
                            </div>
                          }
                        >
                          <motion.div
                            custom={rowIdx * weeks.length + colIdx}
                            variants={cellVariants}
                            initial="hidden"
                            animate="visible"
                            className={`
                              rounded-md py-2 px-1.5 text-xs font-bold
                              cursor-help transition-transform duration-200 hover:scale-110
                              ${colors.bg} ${colors.text}
                            `}
                          >
                            {rate.toFixed(0)}%
                          </motion.div>
                        </Tooltip>
                      ) : (
                        <div className="rounded-md py-2 px-1.5 bg-gray-50 text-gray-300 text-xs font-medium">
                          —
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
