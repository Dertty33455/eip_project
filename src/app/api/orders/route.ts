import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { purchaseSchema } from '@/lib/validations'
import { paymentService } from '@/lib/payments'
import { generateOrderNumber, generateInvoiceNumber, calculateCommission } from '@/lib/utils'
import { z } from 'zod'

// GET /api/orders - Get user orders
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type') || 'bought' // bought | sold
    const status = searchParams.get('status')
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10

    const where: any = {}
    
    if (type === 'sold') {
      where.sellerId = user.id
    } else {
      where.buyerId = user.id
    }

    if (status) {
      where.status = status
    }

    const total = await prisma.order.count({ where })

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
              },
            },
          },
        },
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()

    // Validate input
    const validatedData = purchaseSchema.parse(body)

    // Get books
    const books = await prisma.book.findMany({
      where: {
        id: { in: validatedData.bookIds },
        status: 'ACTIVE',
      },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (books.length === 0) {
      return NextResponse.json(
        { error: 'Aucun livre valide trouvé' },
        { status: 400 }
      )
    }

    // Check if user is trying to buy their own books
    const ownBooks = books.filter((b) => b.sellerId === user.id)
    if (ownBooks.length > 0) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas acheter vos propres livres' },
        { status: 400 }
      )
    }

    // Group books by seller
    const booksBySeller = books.reduce((acc, book) => {
      const sellerId = book.sellerId
      if (!acc[sellerId]) acc[sellerId] = []
      acc[sellerId].push(book)
      return acc
    }, {} as Record<string, typeof books>)

    // Create orders for each seller
    const orders = []

    for (const [sellerId, sellerBooks] of Object.entries(booksBySeller)) {
      const subtotal = sellerBooks.reduce(
        (sum, book) => sum + Number(book.price),
        0
      )
      const { commission, sellerAmount } = calculateCommission(subtotal)
      const totalAmount = subtotal + (validatedData.deliveryType === 'SHIPPING' ? 1500 : 0)

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          buyerId: user.id,
          sellerId,
          status: 'PENDING',
          subtotal,
          commission,
          sellerAmount,
          deliveryFee: validatedData.deliveryType === 'SHIPPING' ? 1500 : 0,
          totalAmount,
          deliveryType: validatedData.deliveryType,
          deliveryAddress: validatedData.deliveryAddress,
          deliveryCity: validatedData.deliveryCity,
          deliveryCountry: validatedData.deliveryCountry,
          deliveryPhone: validatedData.deliveryPhone,
          notes: validatedData.notes,
          items: {
            create: sellerBooks.map((book) => ({
              bookId: book.id,
              quantity: 1,
              price: book.price,
              totalPrice: book.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              book: true,
            },
          },
        },
      })

      // Process payment
      const paymentResult = await paymentService.processPurchase(
        user.id,
        sellerId,
        totalAmount,
        order.id
      )

      if (!paymentResult.success) {
        // Rollback order
        await prisma.order.delete({ where: { id: order.id } })
        return NextResponse.json(
          { error: paymentResult.error },
          { status: 400 }
        )
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
        include: {
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              book: true,
            },
          },
        },
      })

      // Create invoice
      await prisma.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber: generateInvoiceNumber(),
        },
      })

      // Mark books as sold
      await prisma.book.updateMany({
        where: { id: { in: sellerBooks.map((b) => b.id) } },
        data: { status: 'SOLD' },
      })

      // Notify seller
      await prisma.notification.create({
        data: {
          userId: sellerId,
          type: 'SALE_MADE',
          title: 'Nouvelle vente! 🎉',
          message: `${user.firstName} a acheté ${sellerBooks.length} livre(s) pour ${totalAmount} XOF`,
          link: `/orders/${order.id}`,
        },
      })

      // Notify buyer
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'ORDER_PAID',
          title: 'Commande confirmée',
          message: `Votre commande #${order.orderNumber} a été payée`,
          link: `/orders/${order.id}`,
        },
      })

      orders.push(updatedOrder)
    }

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error('Create order error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
