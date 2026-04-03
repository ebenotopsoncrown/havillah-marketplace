import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.5.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { cart, formData, orderId } = await req.json();
    
    if (!cart || cart.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Create line items for Stripe — no VAT, no delivery charge
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.product_name,
          description: `SKU: ${item.sku || 'N/A'}`,
        },
        unit_amount: Math.round(item.unit_price * 100), // exact price in pence, no VAT
      },
      quantity: item.quantity,
    }));

    // Get the app URL for redirects
    const origin = req.headers.get('origin') || 'https://app.base44.com';
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/CustomerStore?payment=success&order_id=${orderId}`,
      cancel_url: `${origin}/CustomerStore?payment=cancelled`,
      customer_email: formData.customer_email,
      metadata: {
        order_id: orderId,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        delivery_type: formData.delivery_type,
        delivery_postcode: formData.delivery_postcode,
      },
      shipping_address_collection: formData.delivery_type === "delivery" ? {
        allowed_countries: ['GB'],
      } : undefined,
    });

    return Response.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});