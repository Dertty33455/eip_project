import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const withCount = searchParams.get('withCount') === 'true'

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: withCount ? {
        _count: {
          select: {
            books: { where: { status: 'ACTIVE' } },
            audiobooks: { where: { status: 'PUBLISHED' } },
          },
        },
      } : undefined,
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}
