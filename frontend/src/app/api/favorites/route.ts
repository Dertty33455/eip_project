import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/favorites - Get user favorites
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type') // BOOK or AUDIOBOOK
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const where: any = {
      userId: user.id,
    }

    if (type) {
      where.type = type
    }

    const total = await prisma.favorite.count({ where })

    const favorites = await prisma.favorite.findMany({
      where,
      include: {
        book: {
          include: {
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
              },
            },
            category: true,
          },
        },
        audiobook: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      favorites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des favoris' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()
    const { type, bookId, audiobookId } = body

    // Check if already favorited
    let existingFavorite
    if (type === 'BOOK' && bookId) {
      existingFavorite = await prisma.favorite.findUnique({
        where: { userId_bookId: { userId: user.id, bookId } },
      })
    } else if (type === 'AUDIOBOOK' && audiobookId) {
      existingFavorite = await prisma.favorite.findUnique({
        where: { userId_audiobookId: { userId: user.id, audiobookId } },
      })
    }

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      })

      return NextResponse.json({
        success: true,
        favorited: false,
      })
    }

    // Add to favorites
    await prisma.favorite.create({
      data: {
        userId: user.id,
        type,
        bookId: type === 'BOOK' ? bookId : undefined,
        audiobookId: type === 'AUDIOBOOK' ? audiobookId : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      favorited: true,
    })
  } catch (error) {
    console.error('Toggle favorite error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des favoris' },
      { status: 500 }
    )
  }
}
