import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { subscriptionSchema } from '@/lib/validations'
import { paymentService } from '@/lib/payments'
import { z } from 'zod'

// GET /api/subscriptions - Get subscription info
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Get active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
    })

    // Get subscription pricing
    const pricing = await prisma.subscriptionPricing.findMany({
      where: { isActive: true },
    })

    // Get subscription history
    const history = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      activeSubscription: subscription,
      pricing,
      history,
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'abonnement' },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions - Subscribe
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = subscriptionSchema.parse(body)

    // Check if already subscribed
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Vous avez déjà un abonnement actif' },
        { status: 400 }
      )
    }

    // Get pricing
    const pricing = await prisma.subscriptionPricing.findUnique({
      where: { plan: validatedData.plan },
    })

    if (!pricing) {
      return NextResponse.json(
        { error: 'Plan non trouvé' },
        { status: 400 }
      )
    }

    // Create subscription
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + pricing.duration)

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: validatedData.plan,
        status: 'PENDING',
        price: pricing.price,
        currency: pricing.currency,
        startDate,
        endDate,
      },
    })

    // Process payment
    const result = await paymentService.processSubscription(
      user.id,
      Number(pricing.price),
      subscription.id
    )

    if (!result.success) {
      // Delete subscription if payment failed
      await prisma.subscription.delete({ where: { id: subscription.id } })
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Update subscription status
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'ACTIVE' },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Abonnement activé! 🎉',
        message: `Votre abonnement ${validatedData.plan} est maintenant actif jusqu'au ${endDate.toLocaleDateString('fr-FR')}`,
        link: '/audiobooks',
      },
    })

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'abonnement' },
      { status: 500 }
    )
  }
}
