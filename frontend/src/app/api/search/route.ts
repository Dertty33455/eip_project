import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/search - Global search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const limit = Number(searchParams.get('limit')) || 10

    if (!query || query.length < 2) {
      return NextResponse.json({
        books: [],
        audiobooks: [],
        users: [],
        posts: [],
      })
    }

    const results: any = {}

    // Search books
    if (type === 'all' || type === 'books') {
      results.books = await prisma.book.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
          ],
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
        take: limit,
      })
    }

    // Search audiobooks
    if (type === 'all' || type === 'audiobooks') {
      results.audiobooks = await prisma.audiobook.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          category: true,
        },
        take: limit,
      })
    }

    // Search users
    if (type === 'all' || type === 'users') {
      results.users = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
          bio: true,
          isVerifiedSeller: true,
          _count: {
            select: {
              followers: true,
              booksSelling: true,
            },
          },
        },
        take: limit,
      })
    }

    // Search posts
    if (type === 'all' || type === 'posts') {
      results.posts = await prisma.post.findMany({
        where: {
          isPublished: true,
          OR: [
            { content: { contains: query, mode: 'insensitive' } },
            { bookTitle: { contains: query, mode: 'insensitive' } },
            { bookAuthor: { contains: query, mode: 'insensitive' } },
          ],
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
        take: limit,
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    )
  }
}
