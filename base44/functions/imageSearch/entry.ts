import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { image_url } = await req.json();

    if (!image_url) {
      return Response.json({ error: 'image_url is required' }, { status: 400 });
    }

    // ── STEP 1: Analyse the query image to extract visual attributes ──
    const analysisResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Carefully examine this product image and extract detailed visual attributes.
Be as specific and precise as possible.

Return a JSON object with these fields:
- product_type: what kind of product is this? (e.g. "men's shirt", "rice bag", "cooking oil bottle", "dress", "trousers")
- color: the primary/dominant colour(s) — be specific (e.g. "navy blue", "white with red stripes", "olive green")
- pattern: the pattern or texture (e.g. "plain", "striped", "floral", "checkered", "geometric", "solid")
- material_or_style: any visible material or style (e.g. "cotton", "silk", "linen", "formal", "casual", "traditional")
- brand_text: any visible brand name or text on the product (e.g. "Nike", "Tilda", "Uncle Ben's"). Empty string if none.
- keywords: a comma-separated list of 5-10 search keywords that best describe this product for finding an exact match`,
      file_urls: [image_url],
      response_json_schema: {
        type: 'object',
        properties: {
          product_type: { type: 'string' },
          color: { type: 'string' },
          pattern: { type: 'string' },
          material_or_style: { type: 'string' },
          brand_text: { type: 'string' },
          keywords: { type: 'string' }
        }
      }
    });

    const attrs = analysisResult;
    const searchKeywords = [
      attrs.brand_text,
      attrs.product_type,
      attrs.color,
      attrs.keywords
    ].filter(Boolean).join(' ').toLowerCase();

    // ── STEP 2: Fetch all active products ──
    const allProducts = await base44.asServiceRole.entities.Product.list();
    const activeProducts = allProducts.filter(p => p.is_active);

    if (activeProducts.length === 0) {
      return Response.json({ matches: [], attributes: attrs });
    }

    // ── STEP 3: Pre-filter products by keyword matching to narrow candidates ──
    const queryWords = searchKeywords.split(/\s+/).filter(w => w.length > 2);

    const scoredProducts = activeProducts.map(product => {
      const haystack = [
        product.name || '',
        product.brand || '',
        product.description || '',
      ].join(' ').toLowerCase();

      let score = 0;
      for (const word of queryWords) {
        if (haystack.includes(word)) score += 1;
      }
      // Bonus: brand text exact match
      if (attrs.brand_text && haystack.includes(attrs.brand_text.toLowerCase())) score += 5;
      // Bonus: product type match
      if (attrs.product_type && haystack.includes(attrs.product_type.toLowerCase().split(/\s+/)[0])) score += 3;

      return { product, score };
    });

    // Sort by score descending, take top candidates (those with images first)
    const sorted = scoredProducts.sort((a, b) => {
      // Prefer products with images
      const aHasImg = (a.product.image_urls?.length > 0) ? 1 : 0;
      const bHasImg = (b.product.image_urls?.length > 0) ? 1 : 0;
      if (b.score !== a.score) return b.score - a.score;
      return bHasImg - aHasImg;
    });

    // Take top 15 candidates for visual comparison
    const candidates = sorted.slice(0, 15).map(s => s.product);

    // ── STEP 4: Visual comparison — send query image + candidate images to LLM ──
    const candidatesWithImages = candidates.filter(p => p.image_urls?.length > 0);
    const candidatesWithoutImages = candidates.filter(p => !p.image_urls?.length);

    let visualMatches = [];

    if (candidatesWithImages.length > 0) {
      // Build image URL list: [query image, ...product images]
      const imageUrls = [image_url, ...candidatesWithImages.map(p => p.image_urls[0])];
      const productList = candidatesWithImages.map((p, i) =>
        `Image ${i + 2}: ID="${p.id}" Name="${p.name}"${p.brand ? ` Brand="${p.brand}"` : ''}`
      ).join('\n');

      const visualResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a precise product matching expert.

Image 1 is the SEARCH IMAGE provided by the customer.
Based on visual analysis, this appears to be: ${attrs.product_type}, colour: ${attrs.color}, pattern: ${attrs.pattern}${attrs.brand_text ? `, brand: ${attrs.brand_text}` : ''}.

The following images are from our product catalogue:
${productList}

Compare Image 1 against each catalogue product image carefully.
Focus on: product type, colour, pattern, brand text visible on packaging, size/shape.

Return an array of matches. For each product image that is a close or exact match to Image 1:
- Include it with a similarity_score from 0-100 (100 = identical match)
- Explain briefly why it matches
- ONLY include products with similarity_score >= 40
- Return empty array if nothing matches well`,
        file_urls: imageUrls,
        response_json_schema: {
          type: 'object',
          properties: {
            matches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  similarity_score: { type: 'number' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        }
      });

      visualMatches = (visualResult.matches || [])
        .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));
    }

    // ── STEP 5: Build final results — visual matches first, then text matches ──
    const matchedIds = new Set(visualMatches.map(m => m.id));

    // Enrich visual matches
    const enrichedVisual = visualMatches.slice(0, 5).map(m => {
      const product = activeProducts.find(p => p.id === m.id);
      return product ? { ...product, match_reason: m.reason, similarity_score: m.similarity_score } : null;
    }).filter(Boolean);

    // If we have fewer than 5 visual matches, fill with text-scored candidates
    let finalMatches = enrichedVisual;
    if (finalMatches.length < 5) {
      const textFallbacks = sorted
        .filter(s => !matchedIds.has(s.product.id) && s.score > 0)
        .slice(0, 5 - finalMatches.length)
        .map(s => ({ ...s.product, match_reason: `Matched keywords: ${attrs.product_type} ${attrs.color}`, similarity_score: Math.min(s.score * 10, 39) }));
      finalMatches = [...finalMatches, ...textFallbacks];
    }

    return Response.json({
      matches: finalMatches,
      detected: attrs
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});