import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { createBookSchema, bookFilterSchema } from '@/lib/validations'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// GET /api/books - List books with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query params
    const filters = {
      search: searchParams.get('search') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      condition: searchParams.get('condition') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      location: searchParams.get('location') || undefined,
      sellerId: searchParams.get('sellerId') || undefined,
      status: searchParams.get('status') || 'ACTIVE',
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
    }

    // Build where clause
    const where: Prisma.BookWhereInput = {
      status: filters.status as any,
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { author: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters.condition) {
      where.condition = filters.condition as any
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {}
      if (filters.minPrice) where.price.gte = filters.minPrice
      if (filters.maxPrice) where.price.lte = filters.maxPrice
    }

    if (filters.location) {
      where.OR = [
        { location: { contains: filters.location, mode: 'insensitive' } },
        { city: { contains: filters.location, mode: 'insensitive' } },
        { country: { contains: filters.location, mode: 'insensitive' } },
      ]
    }

    if (filters.sellerId) {
      where.sellerId = filters.sellerId
    }

    // Get total count
    const total = await prisma.book.count({ where })

    // Get books
    const books = await prisma.book.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
            isVerifiedSeller: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: { [filters.sortBy]: filters.sortOrder },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    })

    // Get average ratings
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const avgRating = await prisma.review.aggregate({
          where: { bookId: book.id },
          _avg: { rating: true },
        })
        return {
          ...book,
          avgRating: avgRating._avg.rating || 0,
        }
      })
    )

    return NextResponse.json({
      books: booksWithRatings,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    })
  } catch (error) {
    console.error('Get books error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des livres' },
      { status: 500 }
    )
  }
}

// POST /api/books - Create new book
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request, ['USER', 'SELLER', 'ADMIN'])
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = createBookSchema.parse(body)

    // Check category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 400 }
      )
    }

    // Create book
    const book = await prisma.book.create({
      data: {
        ...validatedData,
        sellerId: user.id,
        coverImage: validatedData.images[0],
        status: 'ACTIVE',
      },
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
    })

    // Update user role to SELLER if not already
    if (user.role === 'USER') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'SELLER' },
      })
    }

    return NextResponse.json({
      success: true,
      book,
    })
  } catch (error) {
    console.error('Create book error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du livre' },
      { status: 500 }
    )
  }
}
