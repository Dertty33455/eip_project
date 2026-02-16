import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// POST /api/posts/[id]/like - Like/Unlike a post
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

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      return NextResponse.json({
        success: true,
        liked: false,
      })
    }

    // Like
    await prisma.like.create({
      data: {
        userId: user.id,
        postId,
      },
    })

    // Get post author and notify
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    if (post && post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'NEW_LIKE',
          title: 'Nouveau like',
          message: `${user.firstName} a aimé votre publication`,
          link: `/posts/${postId}`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      liked: true,
    })
  } catch (error) {
    console.error('Like post error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du like' },
      { status: 500 }
    )
  }
}
