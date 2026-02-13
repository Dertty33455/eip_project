import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie, getUserFromRequest } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('afribook_token')?.value

    // Delete session from database
    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      })
    }

    // Clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
    
    clearAuthCookie(response)

    return response
  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}
