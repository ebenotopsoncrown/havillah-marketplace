import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { image_url } = await req.json();

    if (!image_url) {
      return Response.json({ error: 'image_url is required' }, { status: 400 });
    }

    // Fetch all active products with images
    const allProducts = await base44.asServiceRole.entities.Product.list();
    const products = allProducts.filter(p => p.is_active && p.image_urls && p.image_urls.length > 0);

    if (products.length === 0) {
      return Response.json({ matches: [] });
    }

    // Build a detailed catalogue with image URLs for the AI to compare visually
    const catalogue = products.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand || '',
      image_url: p.image_urls[0]
    }));

    // Pass the catalogue as text description + the query image to the vision LLM
    // We send the first image of each product alongside the query image for direct visual comparison
    const catalogueForPrompt = catalogue.map((p, i) =>
      `${i + 1}. ID: ${p.id} | Name: ${p.name}${p.brand ? ` | Brand: ${p.brand}` : ''} | Image: ${p.image_url}`
    ).join('\n');

    // Collect all image URLs: query image first, then product images (up to 15 to stay within limits)
    const productSample = catalogue.slice(0, 15);
    const allImageUrls = [image_url, ...productSample.map(p => p.image_url)];
    const sampleCatalogueText = productSample.map((p, i) =>
      `Image ${i + 2}: ID=${p.id} | "${p.name}"${p.brand ? ` by ${p.brand}` : ''}`
    ).join('\n');

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an expert visual product matching assistant.

Image 1 is the QUERY IMAGE — the product the user is searching for.
Images 2 onwards are products from our store catalogue:
${sampleCatalogueText}

Your task:
1. Examine the query image (Image 1) carefully: note the exact colour, pattern, shape, material, style, text/branding, and product type.
2. Compare it visually against every catalogue product image.
3. Return up to 5 product IDs that are the CLOSEST visual match, ranked by similarity (most similar first).
4. Only include a product if it genuinely looks similar — same category, similar colour/pattern/style. Do NOT include unrelated products.
5. If fewer than 5 match, return only the ones that actually match. If none match, return an empty array.

Be strict: colour, pattern and product type must be similar for a match.`,
      file_urls: allImageUrls,
      response_json_schema: {
        type: 'object',
        properties: {
          matches: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                reason: { type: 'string' }
              }
            }
          }
        }
      }
    });

    // If we have more than 15 products, do a second pass with remaining products
    let allMatches = result.matches || [];

    if (catalogue.length > 15) {
      const remainingSample = catalogue.slice(15, 30);
      if (remainingSample.length > 0) {
        const remainingImageUrls = [image_url, ...remainingSample.map(p => p.image_url)];
        const remainingCatalogueText = remainingSample.map((p, i) =>
          `Image ${i + 2}: ID=${p.id} | "${p.name}"${p.brand ? ` by ${p.brand}` : ''}`
        ).join('\n');

        const result2 = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are an expert visual product matching assistant.

Image 1 is the QUERY IMAGE — the product the user is searching for.
Images 2 onwards are products from our store catalogue:
${remainingCatalogueText}

Examine the query image carefully: note exact colour, pattern, shape, material, style, text/branding, product type.
Compare against each catalogue product image.
Return up to 5 product IDs that are the CLOSEST visual match. Only include genuinely similar products. Be strict about colour, pattern and product type.`,
          file_urls: remainingImageUrls,
          response_json_schema: {
            type: 'object',
            properties: {
              matches: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    reason: { type: 'string' }
                  }
                }
              }
            }
          }
        });

        allMatches = [...allMatches, ...(result2.matches || [])];
      }
    }

    // Enrich matches with full product data and limit to top 5
    const enrichedMatches = allMatches.slice(0, 5).map(m => {
      const product = products.find(p => p.id === m.id);
      return product ? { ...product, match_reason: m.reason } : null;
    }).filter(Boolean);

    return Response.json({ matches: enrichedMatches });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});