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
    const cancelBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F8F4F1;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F4F1;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);max-width:600px;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7C3D52 0%,#D88C9A 100%);padding:32px 40px;text-align:center;">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
              alt="Havillah Marketplace" width="60" height="60"
              style="border-radius:12px;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" />
            <h1 style="color:#fff;font-size:24px;margin:0 0 4px;font-weight:700;">Order Cancelled</h1>
            <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">We're sorry to see your order cancelled</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#333;font-size:16px;margin:0 0 8px;">Hi <strong>${order.customer_name}</strong>,</p>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Your order <strong style="color:#D88C9A;">${order.order_number}</strong> has been cancelled.
            </p>
            ${reason ? `
            <div style="background:#fdf2f5;border-left:4px solid #D88C9A;border-radius:8px;padding:16px 20px;font-size:14px;color:#555;margin-bottom:24px;">
              <strong style="color:#7C3D52;">Cancellation Reason:</strong><br/>${reason}
            </div>` : ''}
            ${refundAmount > 0 ? `
            <div style="background:#D1FAE5;border-left:4px solid #059669;border-radius:8px;padding:16px 20px;font-size:14px;color:#065F46;margin-bottom:24px;">
              <strong>Refund: £${refundAmount.toFixed(2)}</strong><br/>
              The refund will appear in your account within 5–10 business days.
            </div>` : ''}
            <p style="color:#555;font-size:13px;margin-bottom:8px;">If you have any questions, contact us at
              <a href="mailto:info@havillahmarketplace.com" style="color:#D88C9A;">info@havillahmarketplace.com</a>
              or WhatsApp <a href="https://wa.me/4407389170996" style="color:#D88C9A;">+44 07389 170996</a>.
            </p>
            <p style="color:#555;font-size:14px;">We hope to serve you again soon. 💛</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#7C3D52;padding:20px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0;">© 2026 Havillah Marketplace · Bournemouth, UK · 🌍 Serving Afro-Asian families across the UK</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: order.customer_email,
      from_name: 'Havillah Marketplace',
      subject: `Order Cancelled - ${order.order_number}`,
      body: cancelBody
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