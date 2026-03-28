import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { customer_name, customer_email, customer_phone, delivery_address, delivery_postcode, marketing_consent, sms_consent } = await req.json();

    if (!customer_name || !customer_email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if contact already exists by email
    const existing = await base44.asServiceRole.entities.AddressBook.filter({ email: customer_email });

    if (existing && existing.length > 0) {
      // Update existing contact
      const contact = existing[0];
      await base44.asServiceRole.entities.AddressBook.update(contact.id, {
        full_name: customer_name,
        phone: customer_phone || contact.phone,
        address: delivery_address || contact.address,
        postcode: delivery_postcode || contact.postcode,
        last_order_date: new Date().toISOString(),
        total_orders: (contact.total_orders || 0) + 1,
        marketing_consent: marketing_consent !== undefined ? marketing_consent : contact.marketing_consent,
        sms_consent: sms_consent !== undefined ? sms_consent : contact.sms_consent,
      });
    } else {
      // Create new contact
      await base44.asServiceRole.entities.AddressBook.create({
        full_name: customer_name,
        email: customer_email,
        phone: customer_phone,
        address: delivery_address,
        postcode: delivery_postcode,
        contact_type: 'customer',
        source: 'checkout',
        marketing_consent: marketing_consent || false,
        sms_consent: sms_consent || false,
        last_order_date: new Date().toISOString(),
        total_orders: 1,
        is_active: true,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});