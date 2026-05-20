-- ============================================================
-- Havillah Marketplace — Supabase Schema
-- Run this in your Supabase project's SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  type        text not null default 'grocery', -- 'grocery' | 'fashion'
  emoji       text,
  description text,
  image_url   text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists products (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  description     text,
  price           numeric(10,2) not null default 0,
  compare_price   numeric(10,2),
  cost_price      numeric(10,2),
  category        text,
  category_id     uuid references categories(id) on delete set null,
  images          jsonb default '[]',        -- array of image URLs
  stock           int not null default 0,
  sku             text,
  barcode         text,
  unit            text default 'each',
  weight          numeric(10,3),
  is_active       boolean default true,
  is_featured     boolean default false,
  tags            text[],
  supplier_id     uuid,
  seller_info     jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz
);

create index if not exists products_category_idx on products(category);
create index if not exists products_sku_idx on products(sku);

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table if not exists customers (
  id           uuid primary key default uuid_generate_v4(),
  full_name    text,
  email        text unique,
  phone        text,
  address      text,
  suburb       text,
  state        text,
  postcode     text,
  country      text default 'Australia',
  notes        text,
  loyalty_points int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz
);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists orders (
  id                 uuid primary key default uuid_generate_v4(),
  order_number       text unique,
  customer_name      text,
  customer_email     text,
  customer_phone     text,
  delivery_address   text,
  suburb             text,
  state              text,
  postcode           text,
  delivery_notes     text,
  fulfillment_type   text default 'delivery', -- 'delivery' | 'pickup'
  status             text not null default 'pending_confirmation',
    -- pending_confirmation | confirmed | picking | packed | dispatched | delivered | cancelled | refunded
  payment_method     text,
  payment_status     text default 'pending',
  subtotal           numeric(10,2) default 0,
  delivery_fee       numeric(10,2) default 0,
  discount           numeric(10,2) default 0,
  total              numeric(10,2) default 0,
  stripe_session_id  text,
  notes              text,
  order_date         timestamptz default now(),
  confirmed_at       timestamptz,
  packed_at          timestamptz,
  dispatched_at      timestamptz,
  delivered_at       timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz
);

create index if not exists orders_status_idx on orders(status);
create index if not exists orders_customer_email_idx on orders(customer_email);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  product_name text not null,
  quantity    int not null default 1,
  unit_price  numeric(10,2) not null,
  total_price numeric(10,2) not null,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz
);

create index if not exists order_items_order_idx on order_items(order_id);

-- ============================================================
-- SALES  (in-store POS transactions)
-- ============================================================
create table if not exists sales (
  id             uuid primary key default uuid_generate_v4(),
  sale_number    text unique,
  cashier_name   text,
  customer_name  text,
  customer_email text,
  payment_method text default 'cash',
  subtotal       numeric(10,2) default 0,
  discount       numeric(10,2) default 0,
  tax            numeric(10,2) default 0,
  total          numeric(10,2) not null default 0,
  amount_tendered numeric(10,2),
  change_given   numeric(10,2),
  notes          text,
  sale_date      timestamptz default now(),
  created_at     timestamptz default now(),
  updated_at     timestamptz
);

-- ============================================================
-- SALE ITEMS
-- ============================================================
create table if not exists sale_items (
  id           uuid primary key default uuid_generate_v4(),
  sale_id      uuid not null references sales(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  product_name text not null,
  quantity     int not null default 1,
  unit_price   numeric(10,2) not null,
  total_price  numeric(10,2) not null,
  created_at   timestamptz default now()
);

create index if not exists sale_items_sale_idx on sale_items(sale_id);

-- ============================================================
-- SUPPLIERS
-- ============================================================
create table if not exists suppliers (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  contact_name text,
  email        text,
  phone        text,
  address      text,
  payment_terms text,
  notes        text,
  is_active    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz
);

-- ============================================================
-- PURCHASE ORDERS
-- ============================================================
create table if not exists purchase_orders (
  id             uuid primary key default uuid_generate_v4(),
  po_number      text unique,
  supplier_id    uuid references suppliers(id) on delete set null,
  supplier_name  text,
  status         text default 'draft', -- draft | ordered | partial | received | cancelled
  subtotal       numeric(10,2) default 0,
  tax            numeric(10,2) default 0,
  total          numeric(10,2) default 0,
  notes          text,
  expected_date  date,
  received_date  date,
  created_at     timestamptz default now(),
  updated_at     timestamptz
);

-- ============================================================
-- PURCHASE ORDER ITEMS
-- ============================================================
create table if not exists purchase_order_items (
  id              uuid primary key default uuid_generate_v4(),
  po_id           uuid not null references purchase_orders(id) on delete cascade,
  product_id      uuid references products(id) on delete set null,
  product_name    text not null,
  quantity_ordered int not null default 0,
  quantity_received int default 0,
  unit_cost       numeric(10,2) not null,
  total_cost      numeric(10,2) not null,
  created_at      timestamptz default now(),
  updated_at      timestamptz
);

-- ============================================================
-- STOCK ADJUSTMENTS
-- ============================================================
create table if not exists stock_adjustments (
  id           uuid primary key default uuid_generate_v4(),
  product_id   uuid references products(id) on delete set null,
  product_name text,
  adjustment   int not null,     -- positive = add, negative = remove
  reason       text,
  adjusted_by  text,
  created_at   timestamptz default now()
);

-- ============================================================
-- EXPENSES
-- ============================================================
create table if not exists expenses (
  id           uuid primary key default uuid_generate_v4(),
  description  text not null,
  category     text,
  amount       numeric(10,2) not null,
  payment_method text,
  supplier_id  uuid references suppliers(id) on delete set null,
  receipt_url  text,
  notes        text,
  expense_date date default current_date,
  created_at   timestamptz default now(),
  updated_at   timestamptz
);

-- ============================================================
-- DELIVERY RUNS
-- ============================================================
create table if not exists delivery_runs (
  id            uuid primary key default uuid_generate_v4(),
  run_number    text unique,
  driver_name   text,
  driver_email  text,
  vehicle       text,
  status        text default 'loading', -- loading | active | completed | cancelled
  order_ids     jsonb default '[]',
  route_data    jsonb,
  started_at    timestamptz,
  completed_at  timestamptz,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz
);

-- ============================================================
-- HERO SLIDES  (storefront banner slider)
-- ============================================================
create table if not exists hero_slides (
  id            uuid primary key default uuid_generate_v4(),
  title         text,
  subtitle      text,
  image_url     text,
  link_url      text,
  button_text   text,
  display_order int default 0,
  is_active     boolean default true,
  category_id   uuid references categories(id) on delete set null,
  created_at    timestamptz default now(),
  updated_at    timestamptz
);

-- ============================================================
-- HERO SETTINGS
-- ============================================================
create table if not exists hero_settings (
  id               uuid primary key default uuid_generate_v4(),
  autoplay         boolean default true,
  autoplay_delay   int default 5000,
  show_indicators  boolean default true,
  show_arrows      boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz
);

-- ============================================================
-- STOREFRONT IMAGES  (named image slots for the homepage)
-- ============================================================
create table if not exists storefront_images (
  id        uuid primary key default uuid_generate_v4(),
  slot      text unique not null,   -- e.g. 'hero_main', 'banner_1'
  label     text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- ============================================================
-- ADDRESS BOOK  (customer delivery addresses)
-- ============================================================
create table if not exists address_book (
  id              uuid primary key default uuid_generate_v4(),
  customer_name   text,
  customer_email  text,
  customer_phone  text,
  address         text,
  suburb          text,
  state           text,
  postcode        text,
  country         text default 'Australia',
  is_default      boolean default false,
  last_order_date timestamptz,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz
);

-- ============================================================
-- AUDIT LOGS  (security / activity log)
-- ============================================================
create table if not exists audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_email  text,
  action      text not null,
  entity      text,
  entity_id   text,
  details     jsonb,
  ip_address  text,
  created_at  timestamptz default now()
);

create index if not exists audit_logs_user_idx on audit_logs(user_email);
create index if not exists audit_logs_created_idx on audit_logs(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- Enable RLS on all tables (open policies for now — tighten per role)
-- ============================================================
alter table categories          enable row level security;
alter table products            enable row level security;
alter table customers           enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;
alter table sales               enable row level security;
alter table sale_items          enable row level security;
alter table suppliers           enable row level security;
alter table purchase_orders     enable row level security;
alter table purchase_order_items enable row level security;
alter table stock_adjustments   enable row level security;
alter table expenses            enable row level security;
alter table delivery_runs       enable row level security;
alter table hero_slides         enable row level security;
alter table hero_settings       enable row level security;
alter table storefront_images   enable row level security;
alter table address_book        enable row level security;
alter table audit_logs          enable row level security;

-- Public read policies (storefront)
create policy "Public read categories"     on categories     for select using (true);
create policy "Public read products"       on products       for select using (true);
create policy "Public read hero_slides"    on hero_slides    for select using (true);
create policy "Public read hero_settings"  on hero_settings  for select using (true);
create policy "Public read storefront_images" on storefront_images for select using (true);

-- Public insert for orders (customers placing orders without login)
create policy "Public insert orders"       on orders       for insert with check (true);
create policy "Public insert order_items"  on order_items  for insert with check (true);
create policy "Public insert address_book" on address_book for insert with check (true);

-- Authenticated staff policies (full access for logged-in users)
create policy "Auth full access categories"          on categories          for all using (auth.role() = 'authenticated');
create policy "Auth full access products"            on products            for all using (auth.role() = 'authenticated');
create policy "Auth full access customers"           on customers           for all using (auth.role() = 'authenticated');
create policy "Auth full access orders"              on orders              for all using (auth.role() = 'authenticated');
create policy "Auth full access order_items"         on order_items         for all using (auth.role() = 'authenticated');
create policy "Auth full access sales"               on sales               for all using (auth.role() = 'authenticated');
create policy "Auth full access sale_items"          on sale_items          for all using (auth.role() = 'authenticated');
create policy "Auth full access suppliers"           on suppliers           for all using (auth.role() = 'authenticated');
create policy "Auth full access purchase_orders"     on purchase_orders     for all using (auth.role() = 'authenticated');
create policy "Auth full access purchase_order_items" on purchase_order_items for all using (auth.role() = 'authenticated');
create policy "Auth full access stock_adjustments"   on stock_adjustments   for all using (auth.role() = 'authenticated');
create policy "Auth full access expenses"            on expenses            for all using (auth.role() = 'authenticated');
create policy "Auth full access delivery_runs"       on delivery_runs       for all using (auth.role() = 'authenticated');
create policy "Auth full access hero_slides"         on hero_slides         for all using (auth.role() = 'authenticated');
create policy "Auth full access hero_settings"       on hero_settings       for all using (auth.role() = 'authenticated');
create policy "Auth full access storefront_images"   on storefront_images   for all using (auth.role() = 'authenticated');
create policy "Auth full access address_book"        on address_book        for all using (auth.role() = 'authenticated');
create policy "Auth full access audit_logs"          on audit_logs          for all using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
insert into storage.buckets (id, name, public)
values ('marketplace-files', 'marketplace-files', true)
on conflict (id) do nothing;

create policy "Public read marketplace-files"
  on storage.objects for select
  using (bucket_id = 'marketplace-files');

create policy "Auth upload marketplace-files"
  on storage.objects for insert
  with check (bucket_id = 'marketplace-files');
