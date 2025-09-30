import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || 'my-super-secret-654321'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature')
    
    console.log('LemonSqueezy Webhook received:', {
      signature,
      body: body.substring(0, 200) + '...' // Log first 200 chars for debugging
    })

    // Verify webhook signature
    if (!signature) {
      console.error('No signature provided')
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 })
    }

    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    const providedSignature = signature.replace('sha256=', '')

    if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(providedSignature))) {
      console.error('Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse the webhook payload
    let webhookData
    try {
      webhookData = JSON.parse(body)
    } catch (parseError) {
      console.error('Failed to parse webhook body:', parseError)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Handle different webhook events
    const eventName = webhookData.meta?.event_name

    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(webhookData)
        break
        
      case 'subscription_updated':
        await handleSubscriptionUpdated(webhookData)
        break
        
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(webhookData)
        break
        
      case 'subscription_resumed':
        await handleSubscriptionResumed(webhookData)
        break
        
      case 'subscription_expired':
        await handleSubscriptionExpired(webhookData)
        break
        
      case 'subscription_paused':
        await handleSubscriptionPaused(webhookData)
        break
        
      default:
        console.log('Unhandled webhook event:', eventName)
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
  
  const subscription = data.data
  const customData = subscription.attributes?.custom_data || {}
  
  const subscriptionData = {
    lemonSqueezySubscriptionId: subscription.id,
    userId: customData.userId,
    planName: customData.planName || 'Pro Monthly',
    status: 'active',
    startDate: new Date(subscription.attributes.created_at),
    amount: subscription.attributes.first_subscription_item?.price || 0,
    currency: subscription.attributes.first_subscription_item?.currency || 'USD',
    renewsAt: new Date(subscription.attributes.renews_at),
  }
  
  console.log('Would update database with:', subscriptionData)
  
  // TODO: Implement database update
  // await updateUserSubscription(subscriptionData)
}

async function handleSubscriptionUpdated(data: any) {
  console.log('Subscription updated:', data)
  
  const subscription = data.data
  
  const updateData = {
    lemonSqueezySubscriptionId: subscription.id,
    status: subscription.attributes.status,
    renewsAt: subscription.attributes.renews_at ? new Date(subscription.attributes.renews_at) : null,
    endsAt: subscription.attributes.ends_at ? new Date(subscription.attributes.ends_at) : null,
  }
  
  console.log('Would update subscription with:', updateData)
  
  // TODO: Implement database update
  // await updateSubscriptionStatus(updateData)
}

async function handleSubscriptionCancelled(data: any) {
  console.log('Subscription cancelled:', data)
  
  const subscription = data.data
  
  const cancelData = {
    lemonSqueezySubscriptionId: subscription.id,
    status: 'cancelled',
    endsAt: new Date(subscription.attributes.ends_at),
  }
  
  console.log('Would cancel subscription:', cancelData)
  
  // TODO: Implement database update
  // await cancelUserSubscription(cancelData)
}

async function handleSubscriptionResumed(data: any) {
  console.log('Subscription resumed:', data)
  
  const subscription = data.data
  
  const resumeData = {
    lemonSqueezySubscriptionId: subscription.id,
    status: 'active',
    renewsAt: new Date(subscription.attributes.renews_at),
  }
  
  console.log('Would resume subscription:', resumeData)
  
  // TODO: Implement database update
  // await resumeUserSubscription(resumeData)
}

async function handleSubscriptionExpired(data: any) {
  console.log('Subscription expired:', data)
  
  const subscription = data.data
  
  const expireData = {
    lemonSqueezySubscriptionId: subscription.id,
    status: 'expired',
    endsAt: new Date(subscription.attributes.ends_at),
  }
  
  console.log('Would expire subscription:', expireData)
  
  // TODO: Implement database update
  // await expireUserSubscription(expireData)
}

async function handleSubscriptionPaused(data: any) {
  console.log('Subscription paused:', data)
  
  const subscription = data.data
  
  const pauseData = {
    lemonSqueezySubscriptionId: subscription.id,
    status: 'paused',
    resumesAt: subscription.attributes.resumes_at ? new Date(subscription.attributes.resumes_at) : null,
  }
  
  console.log('Would pause subscription:', pauseData)
  
  // TODO: Implement database update
  // await pauseUserSubscription(pauseData)
}
