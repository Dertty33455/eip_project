import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payments'

// POST /api/webhooks/moov - Moov Money webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Moov Webhook received:', JSON.stringify(body, null, 2))

    // Extract relevant data from Moov webhook
    const {
      referenceId,
      transactionId,
      status,
      message,
    } = body

    if (!referenceId || !status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    // Map Moov status to our status
    let mappedStatus = status
    if (status === 'SUCCESS' || status === 'SUCCESSFUL' || status === 'COMPLETED') {
      mappedStatus = 'COMPLETED'
    } else if (status === 'FAILED' || status === 'REJECTED' || status === 'ERROR') {
      mappedStatus = 'FAILED'
    } else if (status === 'CANCELLED') {
      mappedStatus = 'CANCELLED'
    }

    // Handle the webhook
    const success = await paymentService.handleWebhook(
      'MOOV_MONEY',
      referenceId,
      mappedStatus,
      {
        transactionId,
        message,
        rawData: body,
      }
    )

    if (!success) {
      console.error('Failed to process Moov webhook:', referenceId)
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Moov Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 }
    )
  }
}
