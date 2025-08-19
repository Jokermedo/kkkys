-- Enable required extensions
create extension if not exists pgcrypto;

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  contact text not null,
  service_id text not null,
  amount numeric(12,2) not null default 0,
  notes text,
  status text not null default 'pending' check (status in ('pending','processing','completed','cancelled'))
);

-- Auto update updated_at on row update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.orders enable row level security;
-- No policies are needed for server-side access using the service role key (it bypasses RLS).
-- If you need anon read access later, define explicit read policies.
