import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('paddle-signature')
    
    console.log('Paddle Webhook received:', {
      signature,
      body: body.substring(0, 200) + '...' // Log first 200 chars for debugging
    })

    // Parse the webhook payload
    let webhookData
    try {
      webhookData = JSON.parse(body)
    } catch (parseError) {
      console.error('Failed to parse webhook body:', parseError)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Handle different webhook events
    const eventType = webhookData.event_type || webhookData.alert_name

    switch (eventType) {
      case 'subscription.created':
      case 'payment.succeeded':
        await handleSubscriptionCreated(webhookData)
        break
        
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(webhookData)
        break
        
      case 'subscription.updated':
        await handleSubscriptionUpdated(webhookData)
        break
        
      case 'payment.failed':
        await handlePaymentFailed(webhookData)
        break
        
      default:
        console.log('Unhandled webhook event:', eventType)
    }

    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data)
  
  // Extract user information from passthrough data
  let passthrough = {}
  try {
    if (data.passthrough) {
      passthrough = JSON.parse(data.passthrough)
    }
  } catch (e) {
    console.error('Failed to parse passthrough data:', e)
  }

  // Here you would typically:
  // 1. Update user subscription status in your database
  // 2. Send confirmation email
  // 3. Enable premium features
  
  const subscriptionData = {
    paddleSubscriptionId: data.subscription_id || data.subscription?.id,
    userId: (passthrough as any).userId,
    planName: (passthrough as any).planName,
    status: 'active',
    startDate: new Date(),
    amount: data.unit_price || data.subscription?.unit_price,
    currency: data.currency || data.subscription?.currency,
  }
  
  console.log('Would update database with:', subscriptionData)
  
  // TODO: Implement database update
  // await updateUserSubscription(subscriptionData)
}

async function handleSubscriptionCancelled(data: any) {
  console.log('Subscription cancelled:', data)
  
  // Here you would typically:
  // 1. Update user subscription status to cancelled
  // 2. Send cancellation confirmation email
  // 3. Set grace period if applicable
  
  // TODO: Implement database update
  // await cancelUserSubscription(data.subscription_id)
}

async function handleSubscriptionUpdated(data: any) {
  console.log('Subscription updated:', data)
  
  // Handle subscription changes like plan upgrades/downgrades
  // TODO: Implement database update
}

async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data)
  
  // Handle failed payments
  // 1. Notify user
  // 2. Potentially suspend service after grace period
  // 3. Log for follow-up
  
  // TODO: Implement payment failure handling
}

// Webhook signature verification (implement when you have the webhook secret)
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  // Implement Paddle signature verification
  // This is important for production to ensure webhooks are from Paddle
  return true // Placeholder - implement proper verification
}
