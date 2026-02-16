import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/admin/users - List all users (admin)
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, ['ADMIN'])
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || undefined
    const role = searchParams.get('role') || undefined
    const status = searchParams.get('status') || undefined
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (role) {
      where.role = role
    }

    if (status) {
      where.status = status
    }

    const total = await prisma.user.count({ where })

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        role: true,
        status: true,
        isVerifiedSeller: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            booksSelling: true,
            booksPurchased: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users - Update user status (admin)
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await withAuth(request, ['ADMIN'])
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { userId, status, role, isVerifiedSeller } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    
    if (status) updateData.status = status
    if (role) updateData.role = role
    if (typeof isVerifiedSeller === 'boolean') updateData.isVerifiedSeller = isVerifiedSeller

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isVerifiedSeller: true,
      },
    })

    // Notify user of status change
    if (status) {
      let message = ''
      if (status === 'BANNED') {
        message = 'Votre compte a été banni pour violation des règles de la plateforme.'
      } else if (status === 'SUSPENDED') {
        message = 'Votre compte a été temporairement suspendu.'
      } else if (status === 'ACTIVE') {
        message = 'Votre compte a été réactivé.'
      }

      if (message) {
        await prisma.notification.create({
          data: {
            userId,
            type: 'SYSTEM',
            title: 'Statut du compte mis à jour',
            message,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    )
  }
}
