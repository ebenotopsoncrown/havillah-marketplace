#!/usr/bin/env node
/**
 * Havillah Marketplace — Base44 → Supabase Product Migration
 *
 * Prerequisites:
 *   1. BASE44_API_KEY   — get from Base44 Dashboard → Settings → API Keys
 *   2. SUPABASE_SERVICE_ROLE_KEY — get from Supabase Dashboard → Settings → API
 *      (the "service_role" key, NOT the anon key — it bypasses RLS for bulk insert)
 *
 * Usage:
 *   BASE44_API_KEY=xxx SUPABASE_SERVICE_ROLE_KEY=yyy node scripts/migrate-products.js
 *
 * Optional flags:
 *   --dry-run   Print what would be inserted without writing to Supabase
 *   --products-only  Skip category migration
 */

import { createClient } from '@supabase/supabase-js';

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const BASE44_APP_ID     = '68f358e0b32516c6bb094fbe';
const BASE44_API_BASE   = 'https://api.base44.com/v1';
const BASE44_API_KEY    = process.env.BASE44_API_KEY || '';

const SUPABASE_URL             = process.env.VITE_SUPABASE_URL || 'https://teqdozksueiejgplqbma.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const DRY_RUN       = process.argv.includes('--dry-run');
const PRODUCTS_ONLY = process.argv.includes('--products-only');

// ─── SUPABASE CLIENT ───────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ─── BASE44 API ────────────────────────────────────────────────────────────────
async function fetchBase44Entity(entityType) {
  const url = `${BASE44_API_BASE}/apps/${BASE44_APP_ID}/entities/${entityType}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${BASE44_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Base44 ${entityType} → HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  // Base44 may return { items: [...] } or { data: [...] } or a bare array
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.items)) return json.items;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

// ─── FIELD MAPPING ─────────────────────────────────────────────────────────────
function transformProduct(b44, catNameMap, catIdMap) {
  const {
    id,
    name,
    description,
    retail_price,
    wholesale_price,
    cost_price,
    stock_quantity,
    image_urls,
    sku,
    barcode,
    weight_kg,
    unit_type,
    is_active,
    is_featured,
    category_id,
    tags,
    // extras → seller_info
    brand,
    vat_rate,
    reorder_level,
    badge,
    discount_percent,
    expiry_tracking,
    created_at,
    updated_at,
    ...rest
  } = b44;

  // Strip internal Base44 meta keys from the rest blob
  const SKIP_KEYS = new Set(['__id', '__type', '__createdAt', '__updatedAt']);
  const extras = Object.fromEntries(
    Object.entries(rest).filter(([k]) => !SKIP_KEYS.has(k))
  );

  const seller_info = {
    ...(brand            !== undefined ? { brand }            : {}),
    ...(vat_rate         !== undefined ? { vat_rate }         : {}),
    ...(reorder_level    !== undefined ? { reorder_level }    : {}),
    ...(badge            !== undefined ? { badge }            : {}),
    ...(discount_percent !== undefined ? { discount_percent } : {}),
    ...(expiry_tracking  !== undefined ? { expiry_tracking }  : {}),
    ...extras,
  };

  // Normalise images: Base44 stores image_urls as string[] or null
  let images = [];
  if (Array.isArray(image_urls)) images = image_urls.filter(Boolean);
  else if (typeof image_urls === 'string' && image_urls) images = [image_urls];

  return {
    id: id || undefined,
    name: name || '',
    description: description || null,
    price: retail_price ?? 0,
    compare_price: wholesale_price ?? null,
    cost_price: cost_price ?? null,
    category: catNameMap[category_id] || null,
    category_id: catIdMap[category_id] || null,
    images,
    stock: stock_quantity ?? 0,
    sku: sku || null,
    barcode: barcode || null,
    unit: unit_type || 'each',
    weight: weight_kg ?? null,
    is_active: is_active ?? true,
    is_featured: is_featured ?? false,
    tags: Array.isArray(tags) && tags.length ? tags : null,
    seller_info: Object.keys(seller_info).length ? seller_info : null,
    created_at: created_at || new Date().toISOString(),
    updated_at: updated_at || null,
  };
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────────
async function migrateCategories() {
  console.log('\n[1/2] Fetching categories from Base44...');
  let categories;
  try {
    categories = await fetchBase44Entity('Category');
  } catch (err) {
    console.error(`  ✗ ${err.message}`);
    console.warn('  ⚠ Continuing without category mapping.');
    return { catNameMap: {}, catIdMap: {} };
  }
  console.log(`  Found ${categories.length} categories.`);

  const catNameMap = {}; // base44_id → category name
  const catIdMap   = {}; // base44_id → supabase uuid (same id since we preserve it)

  for (const cat of categories) {
    catNameMap[cat.id] = cat.name;

    if (DRY_RUN) {
      catIdMap[cat.id] = cat.id;
      console.log(`  [dry-run] Would upsert category: "${cat.name}"`);
      continue;
    }

    const slug = (cat.slug || cat.name || '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const { error } = await supabase.from('categories').upsert(
      {
        id: cat.id,
        name: cat.name || '',
        type: cat.type || 'grocery',
        emoji: cat.emoji || null,
        description: cat.description || null,
        image_url: cat.image_url || cat.image || null,
        sort_order: cat.sort_order ?? 0,
        is_active: cat.is_active ?? true,
        created_at: cat.created_at || new Date().toISOString(),
        updated_at: cat.updated_at || null,
      },
      { onConflict: 'id', ignoreDuplicates: false }
    );

    if (error) {
      console.error(`  ✗ Category "${cat.name}": ${error.message}`);
    } else {
      catIdMap[cat.id] = cat.id;
      console.log(`  ✓ Category "${cat.name}"`);
    }
  }

  return { catNameMap, catIdMap };
}

// ─── PRODUCTS ──────────────────────────────────────────────────────────────────
async function migrateProducts(catNameMap, catIdMap) {
  console.log('\n[2/2] Fetching products from Base44...');
  let products;
  try {
    products = await fetchBase44Entity('Product');
  } catch (err) {
    console.error(`  ✗ ${err.message}`);
    process.exit(1);
  }
  console.log(`  Found ${products.length} products.\n`);

  let ok = 0, fail = 0;

  for (const b44 of products) {
    const row = transformProduct(b44, catNameMap, catIdMap);
    const label = `"${row.name || b44.id}"`;

    if (DRY_RUN) {
      console.log(`  [dry-run] Would upsert product ${label}`);
      console.log(`           price=${row.price}  stock=${row.stock}  images=${row.images.length}`);
      ok++;
      continue;
    }

    const { error } = await supabase.from('products').upsert(row, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(`  ✗ ${label}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${label}`);
      ok++;
    }
  }

  console.log(`\n── Result: ${ok} succeeded, ${fail} failed (${products.length} total)`);
  if (fail > 0) process.exitCode = 1;
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Havillah Marketplace — Base44 → Supabase Migration');
  console.log('====================================================');
  if (DRY_RUN) console.log('DRY RUN — no data will be written\n');

  if (!BASE44_API_KEY) {
    console.error('ERROR: BASE44_API_KEY not set.');
    console.error('  Get it from Base44 Dashboard → Settings → API Keys');
    console.error('  Then run: BASE44_API_KEY=your_key node scripts/migrate-products.js');
    process.exit(1);
  }

  if (!DRY_RUN && !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY not set.');
    console.error('  Get it from Supabase Dashboard → Settings → API → service_role');
    console.error('  Then run: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/migrate-products.js');
    process.exit(1);
  }

  let catNameMap = {}, catIdMap = {};
  if (!PRODUCTS_ONLY) {
    ({ catNameMap, catIdMap } = await migrateCategories());
  }
  await migrateProducts(catNameMap, catIdMap);
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
