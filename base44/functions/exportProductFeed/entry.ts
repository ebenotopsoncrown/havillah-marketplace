import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'csv'; // 'csv' or 'xml'

    const products = await base44.asServiceRole.entities.Product.list();
    const categories = await base44.asServiceRole.entities.Category.list();

    const catMap = {};
    for (const c of categories) catMap[c.id] = c.name;

    const storeUrl = 'https://havillahmarketplace.com';

    const activeProducts = products.filter(p => p.is_active && p.stock_quantity > 0);

    if (format === 'xml') {
      const items = activeProducts.map(p => {
        const img = (p.image_urls && p.image_urls[0]) || '';
        const cat = catMap[p.category_id] || 'General';
        const price = (p.retail_price || 0).toFixed(2);
        const availability = p.stock_quantity > 0 ? 'in stock' : 'out of stock';
        const productUrl = `${storeUrl}/CustomerStore?product=${p.id}`;
        return `
    <item>
      <g:id>${p.sku || p.id}</g:id>
      <title><![CDATA[${p.name || ''}]]></title>
      <description><![CDATA[${p.description || p.name || ''}]]></description>
      <link>${productUrl}</link>
      <g:image_link>${img}</g:image_link>
      <g:price>${price} GBP</g:price>
      <g:availability>${availability}</g:availability>
      <g:brand><![CDATA[${p.brand || 'Havillah Marketplace'}]]></g:brand>
      <g:google_product_category><![CDATA[${cat}]]></g:google_product_category>
      <g:condition>new</g:condition>
      ${p.barcode ? `<g:gtin>${p.barcode}</g:gtin>` : ''}
      <g:shipping>
        <g:country>GB</g:country>
        <g:price>4.50 GBP</g:price>
      </g:shipping>
    </item>`;
      }).join('\n');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Havillah Marketplace Product Feed</title>
    <link>${storeUrl}</link>
    <description>Authentic Nigerian and Indian groceries, beauty and cultural essentials</description>
    ${items}
  </channel>
</rss>`;

      return new Response(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Content-Disposition': 'attachment; filename=havillah-product-feed.xml',
        },
      });
    }

    // Default: CSV
    const headers = [
      'id', 'title', 'description', 'link', 'image_link', 'price', 'sale_price',
      'availability', 'brand', 'google_product_category', 'condition',
      'gtin', 'mpn', 'shipping_weight'
    ];

    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = activeProducts.map(p => {
      const img = (p.image_urls && p.image_urls[0]) || '';
      const cat = catMap[p.category_id] || 'General';
      const price = `${(p.retail_price || 0).toFixed(2)} GBP`;
      const salePrice = p.wholesale_price ? `${p.wholesale_price.toFixed(2)} GBP` : '';
      const availability = p.stock_quantity > 0 ? 'in stock' : 'out of stock';
      const productUrl = `${storeUrl}/CustomerStore?product=${p.id}`;
      return [
        escape(p.sku || p.id),
        escape(p.name),
        escape(p.description || p.name),
        escape(productUrl),
        escape(img),
        escape(price),
        escape(salePrice),
        escape(availability),
        escape(p.brand || 'Havillah Marketplace'),
        escape(cat),
        escape('new'),
        escape(p.barcode || ''),
        escape(p.sku || ''),
        escape(p.weight_kg ? `${p.weight_kg} kg` : ''),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=havillah-product-feed.csv',
      },
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});