import { supabase } from '@/lib/supabase';

// Map entity names to Supabase table names
const TABLE_MAP = {
  Product: 'products',
  Category: 'categories',
  Order: 'orders',
  OrderItem: 'order_items',
  Sale: 'sales',
  SaleItem: 'sale_items',
  Customer: 'customers',
  Supplier: 'suppliers',
  Expense: 'expenses',
  PurchaseOrder: 'purchase_orders',
  PurchaseOrderItem: 'purchase_order_items',
  StockAdjustment: 'stock_adjustments',
  DeliveryRun: 'delivery_runs',
  HeroSlide: 'hero_slides',
  HeroSettings: 'hero_settings',
  StorefrontImage: 'storefront_images',
  AddressBook: 'address_book',
  AuditLog: 'audit_logs',
};

function applySort(query, sort) {
  if (!sort) return query.order('created_at', { ascending: false });
  const ascending = !sort.startsWith('-');
  const field = ascending ? sort : sort.slice(1);
  return query.order(field, { ascending });
}

function createEntityProxy(tableName) {
  return {
    list: async (sort, limit) => {
      let q = supabase.from(tableName).select('*');
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },

    filter: async (filters, sort) => {
      let q = supabase.from(tableName).select('*');
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null) q = q.eq(k, v);
      });
      q = applySort(q, sort);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },

    get: async (id) => {
      const { data, error } = await supabase
        .from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },

    create: async (record) => {
      const { data, error } = await supabase
        .from(tableName)
        .insert([{ ...record, created_at: new Date().toISOString() }])
        .select().single();
      if (error) throw error;
      return data;
    },

    bulkCreate: async (records) => {
      const { data, error } = await supabase
        .from(tableName)
        .insert(records.map(r => ({ ...r, created_at: new Date().toISOString() })))
        .select();
      if (error) throw error;
      return data ?? [];
    },

    update: async (id, record) => {
      const { data, error } = await supabase
        .from(tableName)
        .update({ ...record, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    delete: async (id) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    },

    subscribe: (callback) => {
      const channel = supabase
        .channel(`${tableName}-realtime`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, callback)
        .subscribe();
      return () => supabase.removeChannel(channel);
    },
  };
}

// Build entity map
const entities = {};
Object.entries(TABLE_MAP).forEach(([name, table]) => {
  entities[name] = createEntityProxy(table);
});

// Auth shim — mirrors base44.auth API using Supabase
const auth = {
  me: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }
    // Expose metadata at top level for compatibility
    return { ...user, ...(user.user_metadata ?? {}) };
  },

  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  logout: async (redirectUrl) => {
    await supabase.auth.signOut();
    if (redirectUrl) window.location.href = redirectUrl;
  },

  redirectToLogin: (redirectUrl) => {
    const params = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : '';
    window.location.href = `/staffportal${params}`;
  },
};

// Integrations shim — mirrors base44.integrations.Core API
const integrations = {
  Core: {
    UploadFile: async ({ file }) => {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('marketplace-files')
        .upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage
        .from('marketplace-files')
        .getPublicUrl(fileName);
      return { file_url: data.publicUrl };
    },

    SendEmail: async ({ to, subject, body }) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'noreply@havillahmarketplace.com',
          to: Array.isArray(to) ? to : [to],
          subject,
          html: body,
        }),
      });
      return response.json();
    },

    SendSMS: async ({ to, body }) => {
      console.warn('SMS integration not configured.', { to, body });
      return { success: false };
    },

    InvokeLLM: async ({ prompt, response_json_schema }) => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text ?? '';
      if (response_json_schema) {
        try { return JSON.parse(text); } catch { return text; }
      }
      return text;
    },

    GenerateImage: async ({ prompt }) => {
      console.warn('GenerateImage not implemented. Prompt:', prompt);
      return { url: null };
    },

    ExtractDataFromUploadedFile: async ({ file_url, instructions }) => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          messages: [{
            role: 'user',
            content: `Extract structured data from the file at: ${file_url}\n\nInstructions: ${instructions}`,
          }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text ?? '';
      try { return JSON.parse(text); } catch { return text; }
    },
  },
};

// Server-side function stubs — these were Base44 cloud functions.
// Implement them as Supabase Edge Functions or API routes and update invocations below.
const functions = {
  invoke: async (name, params) => {
    console.warn(`[base44 shim] functions.invoke('${name}') not yet implemented.`, params);
    return { success: false, error: `Function '${name}' needs a Supabase Edge Function implementation.` };
  },
};

const appLogs = {
  logUserInApp: async () => {}, // no-op
};

export const base44 = { entities, auth, integrations, functions, appLogs };
