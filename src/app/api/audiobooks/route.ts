import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/audiobooks - List audiobooks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || undefined
    const categoryId = searchParams.get('categoryId') || undefined
    const isPopular = searchParams.get('isPopular') === 'true'
    const isFeatured = searchParams.get('isFeatured') === 'true'
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 12

    const where: any = {
      status: 'PUBLISHED',
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (isPopular) {
      where.isPopular = true
    }

    if (isFeatured) {
      where.isFeatured = true
    }

    const total = await prisma.audiobook.count({ where })

    const audiobooks = await prisma.audiobook.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        chapters: {
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            duration: true,
            isFree: true,
          },
          orderBy: { chapterNumber: 'asc' },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Get average ratings
    const audiobooksWithRatings = await Promise.all(
      audiobooks.map(async (audiobook) => {
        const avgRating = await prisma.review.aggregate({
          where: { audiobookId: audiobook.id },
          _avg: { rating: true },
        })
        return {
          ...audiobook,
          avgRating: avgRating._avg.rating || 0,
        }
      })
    )

    return NextResponse.json({
      audiobooks: audiobooksWithRatings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get audiobooks error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des livres audio' },
      { status: 500 }
    )
  }
}
