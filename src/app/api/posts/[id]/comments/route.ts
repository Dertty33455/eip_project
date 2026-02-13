import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { createCommentSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/posts/[id]/comments - Get post comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const where = {
      postId,
      parentId: null, // Top-level comments only
    }

    const total = await prisma.comment.count({ where })

    const comments = await prisma.comment.findMany({
      where,
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
        replies: {
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
            _count: {
              select: { likes: true },
            },
          },
          orderBy: { createdAt: 'asc' },
          take: 3,
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commentaires' },
      { status: 500 }
    )
  }
}

// POST /api/posts/[id]/comments - Create comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = createCommentSchema.parse({ ...body, postId })

    // Check post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post non trouvé' },
        { status: 404 }
      )
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: user.id,
        content: validatedData.content,
        parentId: validatedData.parentId,
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

    // Notify post author
    if (post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'NEW_COMMENT',
          title: 'Nouveau commentaire',
          message: `${user.firstName} a commenté votre publication`,
          link: `/posts/${postId}`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('Create comment error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du commentaire' },
      { status: 500 }
    )
  }
}
