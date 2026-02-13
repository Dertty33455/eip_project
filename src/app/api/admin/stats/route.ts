import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/admin/stats - Get admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, ['ADMIN'])
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Get counts
    const [
      totalUsers,
      totalBooks,
      totalAudiobooks,
      totalOrders,
      totalPosts,
      pendingReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.audiobook.count(),
      prisma.order.count(),
      prisma.post.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
    ])

    // Get revenue stats
    const revenueStats = await prisma.transaction.aggregate({
      where: {
        type: 'COMMISSION',
        status: 'COMPLETED',
      },
      _sum: { netAmount: true },
    })

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        seller: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    })

    // Get order stats by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      _sum: { totalAmount: true },
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalBooks,
        totalAudiobooks,
        totalOrders,
        totalPosts,
        pendingReports,
        totalRevenue: Number(revenueStats._sum.netAmount || 0),
      },
      recentUsers,
      recentOrders,
      userGrowth,
      ordersByStatus,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
