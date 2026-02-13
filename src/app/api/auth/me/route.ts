import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { updateProfileSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Get full user with relations
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
        location: true,
        country: true,
        role: true,
        status: true,
        isVerifiedSeller: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        wallet: {
          select: {
            id: true,
            balance: true,
            currency: true,
          },
        },
        _count: {
          select: {
            posts: true,
            booksSelling: true,
            booksPurchased: true,
            followers: true,
            following: true,
            favorites: true,
          },
        },
      },
    })

    // Get active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
    })

    return NextResponse.json({
      user: fullUser,
      subscription,
    })
  } catch (error) {
    console.error('Get me error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

// PATCH /api/auth/me - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = updateProfileSchema.parse(body)

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
        location: true,
        country: true,
        role: true,
        status: true,
        isVerifiedSeller: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}
