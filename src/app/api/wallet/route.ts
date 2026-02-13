import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { depositSchema, withdrawalSchema } from '@/lib/validations'
import { paymentService } from '@/lib/payments'
import { z } from 'zod'

// GET /api/wallet - Get wallet info
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
          currency: 'XOF',
        },
      })
    }

    // Get recent transactions
    const transactions = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Get transaction stats
    const stats = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        walletId: wallet.id,
        status: 'COMPLETED',
      },
      _sum: { netAmount: true },
    })

    const totalDeposits = stats.find((s) => s.type === 'DEPOSIT')?._sum.netAmount || 0
    const totalPurchases = stats.find((s) => s.type === 'PURCHASE')?._sum.netAmount || 0
    const totalSales = stats.find((s) => s.type === 'SALE')?._sum.netAmount || 0
    const totalWithdrawals = stats.find((s) => s.type === 'WITHDRAWAL')?._sum.netAmount || 0

    return NextResponse.json({
      wallet,
      transactions,
      stats: {
        totalDeposits: Number(totalDeposits),
        totalPurchases: Number(totalPurchases),
        totalSales: Number(totalSales),
        totalWithdrawals: Number(totalWithdrawals),
      },
    })
  } catch (error) {
    console.error('Get wallet error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du portefeuille' },
      { status: 500 }
    )
  }
}
