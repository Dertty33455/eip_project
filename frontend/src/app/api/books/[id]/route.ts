import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth, getUserFromRequest } from '@/lib/auth'
import { updateBookSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/books/[id] - Get book details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
            bio: true,
            location: true,
            isVerifiedSeller: true,
            createdAt: true,
            _count: {
              select: {
                booksSelling: { where: { status: 'ACTIVE' } },
                ordersSold: { where: { status: 'DELIVERED' } },
              },
            },
          },
        },
        category: true,
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Livre non trouvé' },
        { status: 404 }
      )
    }

    // Get average rating
    const avgRating = await prisma.review.aggregate({
      where: { bookId: id },
      _avg: { rating: true },
    })

    // Get seller average rating
    const sellerRating = await prisma.review.aggregate({
      where: { sellerId: book.sellerId },
      _avg: { rating: true },
    })

    // Increment view count
    await prisma.book.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    // Check if user has favorited this book
    const user = await getUserFromRequest(request)
    let isFavorited = false
    if (user) {
      const favorite = await prisma.favorite.findFirst({
        where: { userId: user.id, bookId: id },
      })
      isFavorited = !!favorite
    }

    // Get similar books
    const similarBooks = await prisma.book.findMany({
      where: {
        categoryId: book.categoryId,
        id: { not: book.id },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        coverImage: true,
        condition: true,
      },
      take: 4,
    })

    return NextResponse.json({
      book: {
        ...book,
        avgRating: avgRating._avg.rating || 0,
        sellerRating: sellerRating._avg.rating || 0,
        isFavorited,
      },
      similarBooks,
    })
  } catch (error) {
    console.error('Get book error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du livre' },
      { status: 500 }
    )
  }
}

// PATCH /api/books/[id] - Update book
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Find book
    const book = await prisma.book.findUnique({
      where: { id },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Livre non trouvé' },
        { status: 404 }
      )
    }

    // Check ownership (or admin)
    if (book.sellerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Validate input
    const validatedData = updateBookSchema.parse(body)

    // Update book
    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        ...validatedData,
        coverImage: validatedData.images?.[0] || book.coverImage,
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

    return NextResponse.json({
      success: true,
      book: updatedBook,
    })
  } catch (error) {
    console.error('Update book error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du livre' },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[id] - Delete book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Find book
    const book = await prisma.book.findUnique({
      where: { id },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Livre non trouvé' },
        { status: 404 }
      )
    }

    // Check ownership (or admin)
    if (book.sellerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Soft delete (archive)
    await prisma.book.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    })

    return NextResponse.json({
      success: true,
      message: 'Livre supprimé',
    })
  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du livre' },
      { status: 500 }
    )
  }
}
