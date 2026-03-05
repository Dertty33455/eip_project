'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    FiTarget,
    FiTrendingUp,
    FiUsers,
    FiHeadphones,
    FiArrowLeft,
    FiRefreshCw,
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import { useApi, usePmf } from '@/hooks/useApi'
import CohortTable, { type CohortData } from '@/components/ui/CohortTable'

interface PmfScoreData {
    pmf_target: number
    latest_cohort: string | null
    total_users: number
    users_with_audio_7d: number | null
    score: number | null
    target_met: boolean | null
}

interface CohortWeek {
    relative_week: number
    activation_rate: number | null
    activated_users: number | null
}

interface LocalCohortData {
    cohort_week: string
    cohort_label: string
    total_users: number
    weeks: CohortWeek[]
}

interface CohortsResponse {
    pmf_target: number
    cohorts: Array<{
        cohort_week: string
        cohort_label: string
        total_users: number
        weeks: Array<{
            relative_week: number
            active_users: number | null
            total_users: number
            percentage: number | null
        }>
    }>
}

function transformCohorts(response: CohortsResponse | null): LocalCohortData[] {
    if (!response?.cohorts) return []

    return response.cohorts.map((cohort) => ({
        cohort_week: cohort.cohort_week,
        cohort_label: cohort.cohort_label,
        total_users: cohort.total_users,
        weeks: cohort.weeks.map((week) => ({
            relative_week: week.relative_week,
            activation_rate: week.percentage,
            activated_users: week.active_users,
        })),
    }))
}

export default function PmfDashboard() {

    const { getCohorts, getScore } = usePmf()
    const [cohortData, setCohortData] = useState<LocalCohortData[]>([])
    const [pmfScore, setPmfScore] = useState<PmfScoreData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = async () => {
        setRefreshing(true)
        try {
            const [cohortsRes, scoreRes] = await Promise.all([
                getCohorts(12),
                getScore()
            ])

            if (cohortsRes?.data) {
                setCohortData(transformCohorts(cohortsRes.data))
            }
            if (scoreRes?.data) {
                setPmfScore(scoreRes.data)
            }
        } catch (error) {
            console.error('Failed to fetch PMF data:', error)
        } finally {
            setRefreshing(false)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                    <p className="text-sm text-gray-500">Chargement des cohortes…</p>
                </div>
            </div>
        )
    }

    const pmfTarget = pmfScore?.pmf_target ?? 75
    const scoreValue = pmfScore?.score ?? null
    const targetMetStatus = pmfScore?.target_met ?? null
    const latestCohort = cohortData[cohortData.length - 1]
    const latestWeek0 = latestCohort?.weeks.find((w) => w.relative_week === 0)

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900">
                        Product-Market Fit
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Cohortes hebdomadaires · Activation audio à 7 jours
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
                >
                    <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Rafraîchir
                </button>
            </div>

            <div className="space-y-8">
                {/* KPI Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* PMF Score */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Score PMF
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {scoreValue !== null ? `${scoreValue.toFixed(1)}%` : '--'}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${scoreValue !== null && scoreValue >= pmfTarget ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                <FiTarget className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${scoreValue !== null && scoreValue >= pmfTarget ? 'bg-emerald-500' : 'bg-primary'}`}
                                    style={{ width: scoreValue !== null ? `${Math.min(scoreValue, 100)}%` : '0%' }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{pmfTarget}%</span>
                        </div>
                    </div>

                    {/* Target Status */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Objectif
                                </p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    {targetMetStatus === true ? '✅ Atteint' : targetMetStatus === false ? '🔴 Non atteint' : '--'}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                                <FiTrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            Seuil : {pmfTarget}% d'activation à 7j
                        </p>
                    </div>

                    {/* Total Users */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Utilisateurs
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {latestCohort?.total_users ?? '--'}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
                                <FiUsers className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            Dernière cohorte : {latestCohort?.cohort_label ?? '--'}
                        </p>
                    </div>

                    {/* Activated Users */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Activés
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {latestWeek0?.activated_users ?? '--'}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
                                <FiHeadphones className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            Activation audio (W0)
                        </p>
                    </div>
                </motion.div>

                {/* Cohort Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Tableau de cohortes
                        </h2>
                        <p className="text-xs text-gray-400">
                            {cohortData.length} cohorte{cohortData.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <CohortTable data={cohortData} />
                </motion.div>
            </div>
        </div>
    )
}
