import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// GET /api/admin/reports - List reports (admin)
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, ['ADMIN'])
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status') || 'PENDING'
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const where: any = {}

    if (status !== 'all') {
      where.status = status
    }

    const total = await prisma.report.count({ where })

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
        target: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Admin reports error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des signalements' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/reports - Update report status (admin)
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await withAuth(request, ['ADMIN'])
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()
    const { reportId, status, action } = body

    if (!reportId) {
      return NextResponse.json(
        { error: 'ID signalement requis' },
        { status: 400 }
      )
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        post: true,
        comment: true,
        target: true,
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Signalement non trouvé' },
        { status: 404 }
      )
    }

    // Handle action
    if (action === 'delete_content') {
      if (report.postId) {
        await prisma.post.update({
          where: { id: report.postId },
          data: { isPublished: false },
        })
      }
      if (report.commentId) {
        await prisma.comment.delete({
          where: { id: report.commentId },
        })
      }
    } else if (action === 'ban_user' && report.targetId) {
      await prisma.user.update({
        where: { id: report.targetId },
        data: { status: 'BANNED' },
      })
    } else if (action === 'suspend_user' && report.targetId) {
      await prisma.user.update({
        where: { id: report.targetId },
        data: { status: 'SUSPENDED' },
      })
    }

    // Update report
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        resolvedBy: user.id,
        resolvedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      report: updatedReport,
    })
  } catch (error) {
    console.error('Admin update report error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du signalement' },
      { status: 500 }
    )
  }
}
