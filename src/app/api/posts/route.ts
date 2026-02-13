import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { createPostSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/posts - Get posts feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const authorId = searchParams.get('authorId') || undefined
    const type = searchParams.get('type') || undefined
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const where: any = {
      isPublished: true,
      isReported: false,
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (type) {
      where.type = type
    }

    const total = await prisma.post.count({ where })

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
            isVerifiedSeller: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            shares: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = createPostSchema.parse(body)

    // Create post
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        type: validatedData.type,
        content: validatedData.content,
        images: validatedData.images || [],
        bookTitle: validatedData.bookTitle,
        bookAuthor: validatedData.bookAuthor,
        rating: validatedData.rating,
      },
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
    })

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Create post error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du post' },
      { status: 500 }
    )
  }
}
