import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payments'

// POST /api/webhooks/mtn - MTN Mobile Money webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('MTN Webhook received:', JSON.stringify(body, null, 2))

    // Extract relevant data from MTN webhook
    const {
      referenceId,
      externalId,
      status,
      financialTransactionId,
      reason,
    } = body

    if (!referenceId || !status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    // Map MTN status to our status
    let mappedStatus = status
    if (status === 'SUCCESSFUL') {
      mappedStatus = 'COMPLETED'
    } else if (status === 'FAILED') {
      mappedStatus = 'FAILED'
    } else if (status === 'PENDING') {
      mappedStatus = 'PENDING'
    }

    // Handle the webhook
    const success = await paymentService.handleWebhook(
      'MTN_MOMO',
      referenceId,
      mappedStatus,
      {
        financialTransactionId,
        reason,
        rawData: body,
      }
    )

    if (!success) {
      console.error('Failed to process MTN webhook:', referenceId)
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('MTN Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 }
    )
  }
}
