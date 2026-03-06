'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlineDotsVertical,
    HiOutlineExternalLink,
    HiOutlineMailOpen
} from 'react-icons/hi'
import { useNotifications } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function NotificationsPage() {
    const { data, isLoading, getNotifications, markAsRead } = useNotifications()
    const [notifications, setNotifications] = useState<any[]>([])
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        loadNotifications()
    }, [])

    useEffect(() => {
        if (data?.data) {
            setNotifications(data.data)
        }
    }, [data])

    const loadNotifications = async () => {
        await getNotifications()
    }

    const handleMarkAsRead = async (id: string) => {
        await markAsRead([id])
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        )
    }

    const handleMarkAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
        if (unreadIds.length > 0) {
            await markAsRead(unreadIds)
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        }
    }

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.is_read)

    return (
        <div className="min-h-screen bg-cream-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-earth-900 flex items-center gap-3">
                            <HiOutlineBell className="text-primary-500" />
                            Notifications
                        </h1>
                        <p className="text-earth-600 mt-1">Gérez vos alertes et mises à jour</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-1 flex">
                            <button
                                onClick={() => setFilter('all')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    filter === 'all' ? "bg-primary-500 text-white" : "text-earth-600 hover:bg-cream-100"
                                )}
                            >
                                Toutes
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    filter === 'unread' ? "bg-primary-500 text-white" : "text-earth-600 hover:bg-cream-100"
                                )}
                            >
                                Non lues
                            </button>
                        </div>

                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                        >
                            <HiOutlineCheckCircle className="w-5 h-5" />
                            <span className="hidden sm:inline">Tout marquer comme lu</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading && notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-cream-200">
                            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-earth-500">Chargement de vos notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-cream-200 text-center px-4">
                            <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-6">
                                <HiOutlineBell className="w-10 h-10 text-earth-300" />
                            </div>
                            <h3 className="text-xl font-bold text-earth-800 mb-2">Aucune notification</h3>
                            <p className="text-earth-500 max-w-xs mx-auto">
                                {filter === 'unread'
                                    ? "Vous avez lu toutes vos notifications ! Revenez plus tard."
                                    : "Vous n'avez pas encore reçu de notifications."}
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={cn(
                                        "relative group bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md",
                                        notification.is_read ? "border-cream-200 opacity-75" : "border-primary-100 bg-primary-50/10"
                                    )}
                                >
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                            notification.is_read ? "bg-earth-100 text-earth-400" : "bg-primary-100 text-primary-600"
                                        )}>
                                            <NotificationIcon type={notification.type} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h4 className={cn(
                                                        "font-bold text-earth-900 truncate",
                                                        !notification.is_read && "text-primary-700"
                                                    )}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-earth-600 text-sm mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                <p className="text-[10px] text-earth-400 whitespace-nowrap mt-1">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 mt-4">
                                                {notification.link && (
                                                    <Link
                                                        href={notification.link}
                                                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group/link"
                                                    >
                                                        <span>Voir les détails</span>
                                                        <HiOutlineExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                                    </Link>
                                                )}

                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="text-xs font-semibold text-earth-400 hover:text-earth-600 flex items-center gap-1"
                                                    >
                                                        <HiOutlineMailOpen className="w-3.5 h-3.5" />
                                                        <span>Marquer comme lu</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    )
}

function NotificationIcon({ type }: { type: string }) {
    switch (type) {
        case 'NEW_ORDER':
            return <HiOutlineBell className="w-6 h-6" />
        case 'ORDER_STATUS_UPDATE':
            return <HiOutlineCheckCircle className="w-6 h-6" />
        case 'NEW_FOLLOWER':
            return <HiOutlineBell className="w-6 h-6" />
        case 'NEW_MESSAGE':
            return <HiOutlineMailOpen className="w-6 h-6" />
        default:
            return <HiOutlineBell className="w-6 h-6" />
    }
}
