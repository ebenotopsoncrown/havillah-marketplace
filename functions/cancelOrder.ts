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

    const { orderId, cancelledBy, reason } = await req.json();

    if (!orderId) {
      return Response.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // Fetch the order
    const order = await base44.asServiceRole.entities.Order.get(orderId);
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return Response.json({ 
        error: 'Order cannot be cancelled',
        reason: `Order is already ${order.status}` 
      }, { status: 400 });
    }

    let refundAmount = 0;
    let refundId = null;

    // Process refund if paid via card
    if (order.stripe_payment_intent_id && order.payment_status === 'paid') {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: order.stripe_payment_intent_id,
          reason: 'requested_by_customer',
          metadata: {
            order_number: order.order_number,
            cancelled_by: cancelledBy,
            reason: reason || 'Order cancelled'
          }
        });
        
        refundAmount = order.total_amount;
        refundId = refund.id;
      } catch (refundError) {
        console.error('Refund failed:', refundError);
        // Continue with cancellation even if refund fails
      }
    }

    // Update order status
    await base44.asServiceRole.entities.Order.update(orderId, {
      status: 'cancelled',
      cancelled_by: cancelledBy,
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
      refund_amount: refundAmount,
      refund_id: refundId,
      refund_status: refundAmount > 0 ? 'processed' : 'not_applicable'
    });

    // Send cancellation email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: order.customer_email,
      subject: `Order Cancelled - ${order.order_number}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">Order Cancelled</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Your order <strong>${order.order_number}</strong> has been cancelled.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          ${refundAmount > 0 ? `
            <div style="background-color: #D1FAE5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
              <p style="color: #065F46; margin: 0;">
                <strong>Refund Amount:</strong> £${refundAmount.toFixed(2)}<br/>
                The refund will appear in your account within 5-10 business days.
              </p>
            </div>
          ` : ''}
          <p>If you have any questions, please contact us.</p>
          <p>We hope to serve you again soon.</p>
        </div>
      `
    });

    return Response.json({
      success: true,
      orderId: orderId,
      status: 'cancelled',
      refundAmount: refundAmount,
      refundId: refundId
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    return Response.json({ 
      error: 'Failed to cancel order', 
      details: error.message 
    }, { status: 500 });
  }
});