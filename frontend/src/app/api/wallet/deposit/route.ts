import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { depositSchema } from '@/lib/validations'
import { paymentService } from '@/lib/payments'
import { z } from 'zod'

// POST /api/wallet/deposit - Deposit money to wallet
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = depositSchema.parse(body)

    // Process deposit
    const result = await paymentService.processDeposit({
      userId: user.id,
      amount: validatedData.amount,
      provider: validatedData.provider,
      phoneNumber: validatedData.phoneNumber,
      type: 'DEPOSIT',
      description: `Recharge via ${validatedData.provider}`,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Demande de recharge envoyée. Veuillez confirmer sur votre téléphone.',
      transactionId: result.transactionId,
      referenceId: result.referenceId,
    })
  } catch (error) {
    console.error('Deposit error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la recharge' },
      { status: 500 }
    )
  }
}
