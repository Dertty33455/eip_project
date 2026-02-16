import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { withdrawalSchema } from '@/lib/validations'
import { paymentService } from '@/lib/payments'
import { z } from 'zod'

// POST /api/wallet/withdraw - Withdraw money from wallet
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = withdrawalSchema.parse(body)

    // Check minimum/maximum withdrawal
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['min_withdrawal', 'max_withdrawal'] } },
    })
    
    const minWithdrawal = Number(settings.find((s) => s.key === 'min_withdrawal')?.value || 1000)
    const maxWithdrawal = Number(settings.find((s) => s.key === 'max_withdrawal')?.value || 500000)

    if (validatedData.amount < minWithdrawal) {
      return NextResponse.json(
        { error: `Montant minimum: ${minWithdrawal} XOF` },
        { status: 400 }
      )
    }

    if (validatedData.amount > maxWithdrawal) {
      return NextResponse.json(
        { error: `Montant maximum: ${maxWithdrawal} XOF` },
        { status: 400 }
      )
    }

    // Process withdrawal
    const result = await paymentService.processWithdrawal({
      userId: user.id,
      amount: validatedData.amount,
      provider: validatedData.provider,
      phoneNumber: validatedData.phoneNumber,
      type: 'WITHDRAWAL',
      description: `Retrait vers ${validatedData.provider}`,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Demande de retrait envoyée. Vous recevrez les fonds sous peu.',
      transactionId: result.transactionId,
      referenceId: result.referenceId,
    })
  } catch (error) {
    console.error('Withdrawal error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors du retrait' },
      { status: 500 }
    )
  }
}
