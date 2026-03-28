import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, amount, reason } = await req.json();

    if (!orderId || !amount) {
      return Response.json({ error: 'Missing orderId or amount' }, { status: 400 });
    }

    // Fetch the order
    const order = await base44.asServiceRole.entities.Order.get(orderId);
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order has a Stripe payment intent
    if (!order.stripe_payment_intent_id) {
      return Response.json({ 
        error: 'No payment intent found. Order may have been paid with cash/account.',
        canRefund: false 
      }, { status: 400 });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
      amount: Math.round(amount * 100), // Convert to pence
      reason: 'requested_by_customer',
      metadata: {
        order_number: order.order_number,
        reason: reason || 'Item unavailable or price adjustment'
      }
    });

    // Update order with refund information
    await base44.asServiceRole.entities.Order.update(orderId, {
      refund_amount: (order.refund_amount || 0) + amount,
      refund_status: 'processed',
      refund_id: refund.id
    });

    // Send refund confirmation email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: order.customer_email,
      subject: `Refund Processed - ${order.order_number}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Refund Processed</h2>
          <p>Dear ${order.customer_name},</p>
          <p>A refund of <strong>£${amount.toFixed(2)}</strong> has been processed for your order <strong>${order.order_number}</strong>.</p>
          <p><strong>Reason:</strong> ${reason || 'Item unavailable or price adjustment'}</p>
          <p>The refund will appear in your account within 5-10 business days.</p>
          <p>If you have any questions, please contact us.</p>
          <p>Thank you for your understanding.</p>
        </div>
      `
    });

    return Response.json({
      success: true,
      refundId: refund.id,
      amount: amount,
      status: refund.status
    });

  } catch (error) {
    console.error('Refund error:', error);
    return Response.json({ 
      error: 'Failed to process refund', 
      details: error.message 
    }, { status: 500 });
  }
});