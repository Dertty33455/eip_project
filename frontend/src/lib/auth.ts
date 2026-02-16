import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from './prisma'
import { User, UserRole } from '@prisma/client'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key'
)

const TOKEN_EXPIRY = '7d'
const COOKIE_NAME = 'afribook_token'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  exp?: number
  iat?: number
}

export type SafeUser = Omit<User, 'password'>

// Génère un token JWT
export async function generateToken(user: SafeUser): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)

  return token
}

// Vérifie un token JWT
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Get current user from cookies
export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
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
      },
    })

    return user as SafeUser | null
  } catch (error) {
    return null
  }
}

// Get user from request
export async function getUserFromRequest(request: NextRequest): Promise<SafeUser | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    
    if (!token) {
      // Check Authorization header
      const authHeader = request.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const bearerToken = authHeader.substring(7)
        const payload = await verifyToken(bearerToken)
        if (!payload) return null

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        })
        
        if (user) {
          const { password, ...safeUser } = user
          return safeUser
        }
        return null
      }
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (user) {
      const { password, ...safeUser } = user
      return safeUser
    }
    return null
  } catch (error) {
    return null
  }
}

// Set auth cookie
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

// Clear auth cookie
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME)
}

// Middleware auth check
export async function withAuth(
  request: NextRequest,
  allowedRoles?: UserRole[]
): Promise<{ user: SafeUser } | NextResponse> {
  const user = await getUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { error: 'Non autorisé', message: 'Veuillez vous connecter' },
      { status: 401 }
    )
  }

  if (user.status === 'BANNED') {
    return NextResponse.json(
      { error: 'Compte banni', message: 'Votre compte a été suspendu' },
      { status: 403 }
    )
  }

  if (user.status === 'SUSPENDED') {
    return NextResponse.json(
      { error: 'Compte suspendu', message: 'Votre compte est temporairement suspendu' },
      { status: 403 }
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Accès refusé', message: 'Vous n\'avez pas les permissions nécessaires' },
      { status: 403 }
    )
  }

  return { user }
}

// Generate verification token
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AB-${timestamp}-${random}`
}

// Generate unique invoice number
export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV-${year}${month}-${random}`
}
