import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { 
  generateToken, 
  hashPassword, 
  setAuthCookie,
  generateVerificationCode 
} from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
          ...(validatedData.phone ? [{ phone: validatedData.phone }] : []),
        ],
      },
    })

    if (existingUser) {
      if (existingUser.email === validatedData.email) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        )
      }
      if (existingUser.username === validatedData.username) {
        return NextResponse.json(
          { error: 'Ce nom d\'utilisateur est déjà pris' },
          { status: 400 }
        )
      }
      if (validatedData.phone && existingUser.phone === validatedData.phone) {
        return NextResponse.json(
          { error: 'Ce numéro de téléphone est déjà utilisé' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        username: validatedData.username,
        status: 'ACTIVE', // Set to PENDING_VERIFICATION if email verification required
      },
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

    // Create wallet for user
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        currency: 'XOF',
      },
    })

    // Generate JWT token
    const token = await generateToken(user as any)

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: request.headers.get('user-agent') || undefined,
      },
    })

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Bienvenue sur AfriBook! 🎉',
        message: 'Découvrez notre collection de livres africains et rejoignez notre communauté de lecteurs.',
        link: '/explore',
      },
    })

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user,
    })
    
    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error('Register error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
