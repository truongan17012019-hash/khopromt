-- PromptVN: gói chọn N prompt — chạy một lần trên Supabase SQL Editor.
-- Sau khi chạy, user mua SKU plan-* sẽ nhận quota; mỗi lần "mở khóa" trừ 1 quota và ghi user_purchases.

create table if not exists public.user_plan_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  plan_sku_id text not null,
  prompt_quota integer not null check (prompt_quota > 0),
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_plan_entitlements_user
  on public.user_plan_entitlements (user_id);

create table if not exists public.user_plan_prompt_picks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  entitlement_id uuid not null references public.user_plan_entitlements(id) on delete cascade,
  prompt_id text not null,
  created_at timestamptz not null default now(),
  unique (entitlement_id, prompt_id)
);

create index if not exists idx_user_plan_prompt_picks_user
  on public.user_plan_prompt_picks (user_id);

create unique index if not exists idx_user_plan_prompt_picks_user_prompt
  on public.user_plan_prompt_picks (user_id, prompt_id);
