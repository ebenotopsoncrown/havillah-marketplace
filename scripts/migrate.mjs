/**
 * Havillah Marketplace — Base44 CSV → Supabase Migration
 * Usage: node scripts/migrate.mjs
 *
 * ⚠ BEFORE RUNNING — fix your Supabase key:
 *   SUPABASE_KEY below must be the SERVICE ROLE key (not anon).
 *   Get it: Supabase Dashboard → Settings → API → service_role
 *   The anon key blocks all product/image writes via RLS.
 *
 * Optional env overrides:
 *   SUPABASE_KEY=xxx node scripts/migrate.mjs
 *   DRY_RUN=1 node scripts/migrate.mjs    (no writes, just preview)
 */

import { createClient } from '@supabase/supabase-js';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import fetch from 'node-fetch';

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL
  || 'https://raseuvzhnjcjyflmdjpl.supabase.co';

const SUPABASE_KEY = process.env.SUPABASE_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhc2V1dnpobmpjanlmbG1kanBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE3MjMyNiwiZXhwIjoyMDk0NzQ4MzI2fQ.Gdo9-MsVIg6DanZ2OIK4ErLT4bko9GvSbwjKmfd9MJY';

const BASE44_APP_ID  = '6978a8de9be83b8a34f67a8d';
const BASE44_API_KEY = '75062287203f4a33a5d4edef39eaa99a';
const BASE44_API_BASE = 'https://api.base44.com/v1';

const CSV_PATH = 'C:/Users/PC/Downloads/Product_export.csv';
const DRY_RUN  = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run');

// ─── CLIENTS ───────────────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// ─── BASE44 IMAGE DOWNLOAD ─────────────────────────────────────────────────────
async function downloadImage(url) {
  // Images under /files/public/ are usually accessible without auth;
  // try authenticated first as fallback.
  const attempts = [
    () => fetch(url),
    () => fetch(url, {
      headers: {
        'api_key': BASE44_API_KEY,
        'x-api-key': BASE44_API_KEY,
        'Authorization': `Bearer ${BASE44_API_KEY}`,
      },
    }),
  ];
  for (const attempt of attempts) {
    try {
      const res = await attempt();
      if (res.ok) return res;
    } catch { /* try next */ }
  }
  return null;
}

async function migrateImage(imageUrl, productIdx, imageIdx) {
  try {
    const res = await downloadImage(imageUrl);
    if (!res) throw new Error('All download attempts failed');

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) throw new Error(`Suspiciously small (${buffer.length} bytes)`);

    const ct  = res.headers.get('content-type') || 'image/jpeg';
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp'
      : ct.includes('gif') ? 'gif' : 'jpg';

    const filename = `products/p${productIdx}-img${imageIdx}-${Date.now()}.${ext}`;

    if (DRY_RUN) {
      return `[dry-run] ${filename}`;
    }

    const { error } = await supabase.storage
      .from('marketplace-files')
      .upload(filename, buffer, { contentType: ct, upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from('marketplace-files').getPublicUrl(filename);
    return data.publicUrl;
  } catch (err) {
    return { failed: true, original: imageUrl, reason: err.message };
  }
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function parseImageUrls(field) {
  if (!field) return [];
  const s = field.trim();
  if (s.startsWith('[')) {
    try { return JSON.parse(s).filter(Boolean); } catch { /* fall through */ }
  }
  if (s.includes(',http')) return s.split(',').map(u => u.trim()).filter(Boolean);
  return s ? [s] : [];
}

function detectCategoryType(name) {
  const n = (name || '').toLowerCase();
  if (/grocery|food|rice|spice|oil|sauce|yam|plantain|bean|pea/.test(n)) return 'grocery';
  if (/beauty|skin|hair|cream|lotion|soap|makeup/.test(n)) return 'beauty';
  return 'fashion';
}

function num(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }
function int(v) { const n = parseInt(v);  return isNaN(n) ? null : n; }
function bool(v) { return v === 'true' || v === true || v === '1'; }

// ─── CATEGORIES ────────────────────────────────────────────────────────────────
async function migrateCategories() {
  console.log('[1/3] Fetching categories from Base44 API...');
  const catNameMap = {}; // base44_id → category name

  try {
    const res = await fetch(`${BASE44_API_BASE}/apps/${BASE44_APP_ID}/entities/Category`, {
      headers: { 'api_key': BASE44_API_KEY, 'x-api-key': BASE44_API_KEY },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const cats  = Array.isArray(json) ? json : (json.items || json.data || []);

    console.log(`  Found ${cats.length} categories.`);
    for (const cat of cats) {
      catNameMap[cat.id] = cat.name;
      if (DRY_RUN) {
        console.log(`  [dry] would upsert category "${cat.name}"`);
        continue;
      }
      const { error } = await supabase.from('categories').upsert({
        id:          cat.id,
        name:        cat.name || '',
        type:        cat.type || detectCategoryType(cat.name),
        emoji:       cat.emoji || null,
        description: cat.description || null,
        image_url:   cat.image_url || cat.image || null,
        sort_order:  int(cat.sort_order) ?? 0,
        is_active:   bool(cat.is_active ?? true),
        created_at:  cat.created_date || cat.created_at || new Date().toISOString(),
      }, { onConflict: 'id', ignoreDuplicates: false });
      if (error) console.error(`  ✗ Category "${cat.name}": ${error.message}`);
      else       console.log( `  ✓ Category "${cat.name}"`);
    }
  } catch (err) {
    console.warn(`  ⚠ Category fetch failed: ${err.message}`);
    console.warn('  Products will have category name text only (category_id → null).');
  }

  return catNameMap;
}

// ─── PRODUCTS ──────────────────────────────────────────────────────────────────
async function migrateProducts(catNameMap) {
  // ── Read CSV ────────────────────────────────────────────────────────────────
  console.log('\n[2/3] Reading CSV...');
  const rows = [];
  await new Promise((resolve, reject) => {
    createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true, bom: true }))
      .on('data', r => rows.push(r))
      .on('end', resolve)
      .on('error', reject);
  });
  console.log(`  ${rows.length} products found.`);
  if (rows.length > 0) {
    console.log(`  Columns: ${Object.keys(rows[0]).join(', ')}`);
  }

  // ── Process each product ────────────────────────────────────────────────────
  console.log('\n[3/3] Migrating products...');
  let okProducts = 0, failProducts = 0;
  let okImages   = 0, failImages   = 0;

  for (let i = 0; i < rows.length; i++) {
    const row   = rows[i];
    const label = (row.name || `row-${i+1}`).substring(0, 60);
    console.log(`\n[${String(i+1).padStart(2,'0')}/${rows.length}] ${label}`);

    // ── Images ───────────────────────────────────────────────────────────────
    const rawUrls     = parseImageUrls(row.image_urls);
    const finalImages = [];
    for (let j = 0; j < rawUrls.length; j++) {
      process.stdout.write(`  Image ${j+1}/${rawUrls.length} ... `);
      const result = await migrateImage(rawUrls[j], i + 1, j + 1);
      if (result && !result.failed) {
        process.stdout.write(`✓\n`);
        finalImages.push(result);
        okImages++;
      } else {
        process.stdout.write(`✗ ${result?.reason || 'unknown'}\n`);
        finalImages.push(rawUrls[j]); // keep original URL as fallback
        failImages++;
      }
    }

    // ── Build row ─────────────────────────────────────────────────────────────
    const hasCategory = catNameMap[row.category_id] !== undefined;
    const productRow = {
      // Base44 IDs are 24-char hex (not UUID) — let Supabase generate a proper UUID.
      // The original Base44 ID is preserved in seller_info.base44_id for reference.
      name:         row.name     || '',
      description:  row.description || null,
      price:        num(row.retail_price)    ?? 0,
      compare_price:num(row.wholesale_price) ?? null,
      cost_price:   num(row.cost_price)      ?? null,
      category:     catNameMap[row.category_id] || null,
      category_id:  hasCategory ? row.category_id : null,
      images:       finalImages,
      stock:        int(row.stock_quantity) ?? 0,
      sku:          row.sku      || null,
      barcode:      row.barcode  || null,
      unit:         row.unit_type || 'each',
      weight:       num(row.weight_kg) ?? null,
      is_active:    bool(row.is_active),
      is_featured:  false,
      tags:         null,
      seller_info: {
        base44_id:         row.id               || null,   // preserve original ID
        brand:             row.brand             || null,
        vat_rate:          num(row.vat_rate),
        reorder_level:     int(row.reorder_level),
        badge:             row.badge             || null,
        discount_percent:  num(row.discount_percent),
        expiry_tracking:   bool(row.expiry_tracking),
        location:          row.location          || null,
        units_per_carton:  int(row.units_per_carton),
        reserved_quantity: int(row.reserved_quantity),
        is_sample:         bool(row.is_sample),
      },
      created_at: row.created_date || new Date().toISOString(),
      updated_at: row.updated_date || null,
    };

    if (DRY_RUN) {
      console.log(`  [dry] price=${productRow.price} stock=${productRow.stock} images=${finalImages.length}`);
      okProducts++;
      continue;
    }

    const { error } = await supabase
      .from('products')
      .upsert(productRow, { onConflict: 'id', ignoreDuplicates: false });

    if (error) {
      console.error(`  ✗ DB error: ${error.message}`);
      failProducts++;
    } else {
      console.log(`  ✓ Saved (${finalImages.length} image${finalImages.length !== 1 ? 's' : ''})`);
      okProducts++;
    }

    // Throttle slightly to avoid hammering Base44 image servers
    await new Promise(r => setTimeout(r, 250));
  }

  return { okProducts, failProducts, okImages, failImages, total: rows.length };
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║   HAVILLAH MARKETPLACE — MIGRATION        ║');
  console.log('║   Base44 CSV + Images → Supabase          ║');
  if (DRY_RUN) {
  console.log('║   DRY RUN — no data will be written        ║');
  }
  console.log('╚═══════════════════════════════════════════╝\n');

  // Quick connectivity check
  if (!DRY_RUN) {
    const { error: pingErr } = await supabase.from('products').select('id').limit(1);
    if (pingErr) {
      console.error(`ERROR: Cannot connect to Supabase — ${pingErr.message}`);
      console.error('  Check your SUPABASE_URL and SUPABASE_KEY (must be service_role).');
      process.exit(1);
    }
    console.log('✓ Supabase connection OK\n');
  }

  const catNameMap = await migrateCategories();

  const { okProducts, failProducts, okImages, failImages, total } =
    await migrateProducts(catNameMap);

  // Final verification query
  let dbCount = null;
  if (!DRY_RUN) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    dbCount = count;
  }

  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║   MIGRATION COMPLETE                       ║');
  console.log('╠═══════════════════════════════════════════╣');
  console.log(`║   Products:  ${String(okProducts).padEnd(4)} ✓   ${String(failProducts).padEnd(4)} ✗   of ${total}`.padEnd(44) + '║');
  console.log(`║   Images:    ${String(okImages).padEnd(4)} ✓   ${String(failImages).padEnd(4)} ✗`.padEnd(44) + '║');
  if (dbCount !== null) {
  console.log(`║   Supabase total products now: ${dbCount}`.padEnd(44) + '║');
  }
  if (failProducts > 0) {
  console.log(`║   ⚠ ${failProducts} product(s) failed — check errors above`.padEnd(44) + '║');
  }
  if (failImages > 0) {
  console.log(`║   ⚠ ${failImages} image(s) kept original URL (not re-hosted)`.padEnd(44) + '║');
  }
  console.log('╚═══════════════════════════════════════════╝\n');

  if (failProducts > 0) process.exitCode = 1;
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
