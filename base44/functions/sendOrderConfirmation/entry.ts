import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { orderId } = await req.json();

    if (!orderId) {
      return Response.json({ error: 'orderId required' }, { status: 400 });
    }

    // Fetch order and its items
    const order = await base44.asServiceRole.entities.Order.get(orderId);
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const allItems = await base44.asServiceRole.entities.OrderItem.filter({ order_id: orderId });

    if (!order.customer_email) {
      return Response.json({ error: 'No customer email on order' }, { status: 400 });
    }

    // Build items table rows
    const itemRows = allItems.map(item =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8e8;">${item.product_name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8e8;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8e8;text-align:right;">£${item.unit_price?.toFixed(2)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8e8;text-align:right;">£${item.line_total?.toFixed(2)}</td>
      </tr>`
    ).join('');

    const deliveryInfo = order.delivery_type === 'delivery'
      ? `<p><strong>Delivery address:</strong> ${order.delivery_address}, ${order.delivery_postcode}</p>
         ${order.delivery_slot ? `<p><strong>Preferred time slot:</strong> ${order.delivery_slot}</p>` : ''}`
      : `<p><strong>Collection:</strong> Please collect from our store in Bournemouth.</p>`;

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
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
            <h1 style="color:#fff;font-size:24px;margin:0 0 4px;font-weight:700;">Order Confirmed!</h1>
            <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Thank you for shopping with Havillah Marketplace 🎉</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#333;font-size:16px;margin:0 0 8px;">Hi <strong>${order.customer_name}</strong>,</p>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
              We've received your order <strong style="color:#D88C9A;">${order.order_number}</strong> and it is currently being reviewed by our team.
              We'll send you another update once it's confirmed and ready.
            </p>

            <!-- Order Summary -->
            <h3 style="color:#7C3D52;font-size:16px;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #f0e8e8;">Order Summary</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:#fdf2f5;">
                  <th style="padding:10px 12px;text-align:left;font-size:13px;color:#7C3D52;">Item</th>
                  <th style="padding:10px 12px;text-align:center;font-size:13px;color:#7C3D52;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#7C3D52;">Price</th>
                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#7C3D52;">Total</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding:4px 0;color:#777;font-size:13px;">Subtotal</td>
                <td style="padding:4px 0;text-align:right;font-size:13px;">£${order.subtotal?.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#777;font-size:13px;">Delivery</td>
                <td style="padding:4px 0;text-align:right;font-size:13px;color:#16a34a;">FREE</td>
              </tr>
              <tr>
                <td style="padding:8px 0 4px;font-weight:700;font-size:16px;color:#333;border-top:2px solid #f0e8e8;">Total Paid</td>
                <td style="padding:8px 0 4px;text-align:right;font-weight:700;font-size:16px;color:#D88C9A;border-top:2px solid #f0e8e8;">£${order.total_amount?.toFixed(2)}</td>
              </tr>
            </table>

            <!-- Delivery Info -->
            <div style="background:#fdf2f5;border-radius:10px;padding:16px 20px;margin-bottom:24px;font-size:13px;color:#555;line-height:1.7;">
              <h4 style="color:#7C3D52;margin:0 0 8px;font-size:14px;">📦 Delivery Details</h4>
              ${deliveryInfo}
              <p style="margin:8px 0 0;"><strong>Payment:</strong> ${order.payment_method?.replace(/_/g, ' ')}</p>
            </div>

            <!-- What's Next -->
            <div style="background:#f0f7ff;border-left:4px solid #6366f1;border-radius:8px;padding:16px 20px;font-size:13px;color:#444;line-height:1.7;margin-bottom:24px;">
              <strong style="color:#4338ca;">What happens next?</strong><br/>
              Our team will review your order and confirm product availability. Once confirmed, you'll receive a follow-up email with your order status.
            </div>

            <p style="color:#555;font-size:13px;">If you have any questions, contact us at 
              <a href="mailto:info@havillahmarketplace.com" style="color:#D88C9A;">info@havillahmarketplace.com</a> 
              or WhatsApp <a href="https://wa.me/4407389170996" style="color:#D88C9A;">+44 07389 170996</a>.
            </p>
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
      subject: `Order Received – ${order.order_number} 🛒`,
      body: emailBody
    });

    return Response.json({ success: true, message: `Confirmation email sent to ${order.customer_email}` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});