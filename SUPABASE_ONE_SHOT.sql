-- PromptVN - Supabase one-shot setup
-- Run this whole file once in Supabase SQL Editor.

begin;

create extension if not exists pgcrypto;

-- =========================
-- Core tables
-- =========================

create table if not exists public.profiles (
  id text primary key,
  full_name text,
  avatar_url text,
  points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prompts (
  id text primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  price integer not null check (price >= 0),
  original_price integer check (original_price is null or original_price >= price),
  category_id text not null,
  tool_id text not null,
  rating numeric(2,1) not null default 0.0,
  review_count integer not null default 0,
  sold integer not null default 0,
  preview text not null,
  full_content text,
  tags text[] not null default '{}',
  difficulty text not null check (difficulty in ('Dễ', 'Trung bình', 'Nâng cao')),
  author_name text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  total_amount integer not null check (total_amount >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  coupon_code text,
  payment_method text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'awaiting_review', 'paid', 'failed')),
  transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  prompt_id text not null references public.prompts(id) on delete restrict,
  price integer not null check (price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.user_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  prompt_id text not null references public.prompts(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, prompt_id)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  prompt_id text not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, prompt_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  prompt_id text not null references public.prompts(id) on delete cascade,
  user_id text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_verified_purchase boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value integer not null check (discount_value > 0),
  min_order_amount integer not null default 0,
  max_uses integer not null default 0,
  used_count integer not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null default '📁',
  description text not null default '',
  count integer not null default 0,
  color text not null default 'bg-gray-500',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_review_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  reviewer text not null,
  action text not null check (action in ('approved', 'rejected')),
  note text,
  created_at timestamptz not null default now()
);

-- =========================
-- Indexes
-- =========================

create index if not exists idx_prompts_active_created on public.prompts(is_active, created_at desc);
create index if not exists idx_prompts_category on public.prompts(category_id);
create index if not exists idx_prompts_tool on public.prompts(tool_id);
create index if not exists idx_orders_user_created on public.orders(user_id, created_at desc);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_user_purchases_user on public.user_purchases(user_id);
create index if not exists idx_reviews_prompt_created on public.reviews(prompt_id, created_at desc);
create index if not exists idx_categories_sort on public.categories(sort_order asc, id asc);
create index if not exists idx_order_review_logs_order_created on public.order_review_logs(order_id, created_at desc);

-- =========================
-- Triggers (updated_at)
-- =========================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_prompts_updated_at on public.prompts;
create trigger trg_prompts_updated_at
before update on public.prompts
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_coupons_updated_at on public.coupons;
create trigger trg_coupons_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

drop trigger if exists trg_app_settings_updated_at on public.app_settings;
create trigger trg_app_settings_updated_at
before update on public.app_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

-- =========================
-- RPC functions used by app
-- =========================

create or replace function public.increment_sold(prompt_uuid text)
returns void
language sql
as $$
  update public.prompts
  set sold = sold + 1,
      updated_at = now()
  where id = prompt_uuid;
$$;

create or replace function public.add_user_points(user_uuid text, point_amount integer)
returns void
language plpgsql
as $$
begin
  insert into public.profiles (id, points)
  values (user_uuid, greatest(point_amount, 0))
  on conflict (id) do update
    set points = public.profiles.points + greatest(point_amount, 0),
        updated_at = now();
end;
$$;

create or replace function public.refresh_prompt_rating(prompt_id_input text)
returns void
language sql
as $$
  update public.prompts p
  set
    rating = coalesce(round(avg(r.rating)::numeric, 1), 0),
    review_count = coalesce(count(r.id), 0),
    updated_at = now()
  from public.reviews r
  where p.id = prompt_id_input
    and r.prompt_id = prompt_id_input
  group by p.id;
$$;

-- =========================
-- Basic RLS
-- =========================

alter table public.prompts enable row level security;
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.user_purchases enable row level security;
alter table public.profiles enable row level security;
alter table public.coupons enable row level security;
alter table public.app_settings enable row level security;
alter table public.categories enable row level security;
alter table public.order_review_logs enable row level security;

-- Public read for active prompts (used by catalog)
drop policy if exists prompts_public_read on public.prompts;
create policy prompts_public_read
on public.prompts for select
using (is_active = true);

-- Reviews readable by all, write by authenticated users.
drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read
on public.reviews for select
using (true);

drop policy if exists reviews_auth_insert on public.reviews;
create policy reviews_auth_insert
on public.reviews for insert
to authenticated
with check (true);

-- Optional: keep user-owned data private when using authenticated JWT id as user_id.
drop policy if exists wishlists_owner_all on public.wishlists;
create policy wishlists_owner_all
on public.wishlists for all
to authenticated
using (user_id = auth.uid()::text)
with check (user_id = auth.uid()::text);

drop policy if exists orders_owner_read on public.orders;
create policy orders_owner_read
on public.orders for select
to authenticated
using (user_id = auth.uid()::text);

drop policy if exists purchases_owner_read on public.user_purchases;
create policy purchases_owner_read
on public.user_purchases for select
to authenticated
using (user_id = auth.uid()::text);

drop policy if exists profiles_owner_all on public.profiles;
create policy profiles_owner_all
on public.profiles for all
to authenticated
using (id = auth.uid()::text)
with check (id = auth.uid()::text);

-- Coupons readable only for authenticated users (adjust as needed).
drop policy if exists coupons_auth_read on public.coupons;
create policy coupons_auth_read
on public.coupons for select
to authenticated
using (is_active = true);

drop policy if exists app_settings_auth_read on public.app_settings;
create policy app_settings_auth_read
on public.app_settings for select
to authenticated
using (true);

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
on public.categories for select
using (is_active = true);

drop policy if exists order_review_logs_auth_read on public.order_review_logs;
create policy order_review_logs_auth_read
on public.order_review_logs for select
to authenticated
using (true);

-- =========================
-- Minimal seed (safe upsert)
-- =========================

insert into public.coupons (code, discount_type, discount_value, min_order_amount, max_uses, used_count, is_active)
values
  ('WELCOME10', 'percent', 10, 0, 1000, 0, true)
on conflict (code) do nothing;

insert into public.app_settings (key, value)
values
  ('payment_mode', 'mock'),
  ('momo_enabled', 'true'),
  ('vnpay_enabled', 'true'),
  ('bank_enabled', 'true'),
  ('bank_name', ''),
  ('bank_account_number', ''),
  ('bank_account_holder', ''),
  ('bank_qr_image', ''),
  ('bank_transfer_note', 'Vui lòng ghi đúng mã đơn hàng trong nội dung chuyển khoản.'),
  ('seo_site_name', 'PromptVN'),
  ('seo_base_url', 'https://khopromt.pro'),
  ('seo_default_title', 'PromptVN - Mua bán Prompt AI hàng đầu Việt Nam'),
  ('seo_default_description', 'Khám phá 600+ prompt AI chất lượng cao cho ChatGPT, Claude, Midjourney, DALL-E.'),
  ('seo_default_og_image', '/og-image.jpg'),
  ('seo_google_verification', ''),
  ('seo_category_overrides', '{}'),
  ('pricing_plans', '{}'),
  ('admin_email', 'admin@gmail.com')
on conflict (key) do update set value = excluded.value;

insert into public.categories (id, name, icon, description, count, color, sort_order, is_active)
values
  ('viet-content', 'Viết Content', '✍️', 'Prompt viết bài blog, quảng cáo, email marketing', 100, 'bg-blue-500', 1, true),
  ('lap-trinh', 'Lập Trình', '💻', 'Prompt hỗ trợ code, debug, kiến trúc phần mềm', 100, 'bg-green-500', 2, true),
  ('thiet-ke-anh', 'Thiết Kế Ảnh', '🎨', 'Prompt tạo ảnh Midjourney, DALL-E, Stable Diffusion', 100, 'bg-purple-500', 3, true),
  ('marketing', 'Marketing & SEO', '📈', 'Prompt chiến lược marketing, SEO, quảng cáo', 100, 'bg-orange-500', 4, true),
  ('giao-duc', 'Giáo Dục', '📚', 'Prompt dạy học, tạo bài tập, soạn giáo án', 100, 'bg-teal-500', 5, true),
  ('kinh-doanh', 'Kinh Doanh', '💼', 'Prompt lập kế hoạch, phân tích, báo cáo', 100, 'bg-red-500', 6, true)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  description = excluded.description,
  count = excluded.count,
  color = excluded.color,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

commit;

-- Next step:
-- 1) Import your prompt catalog into public.prompts
-- 2) Set env vars on Vercel:
--    NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
-- 3) Redeploy production
