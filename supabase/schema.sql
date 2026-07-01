-- Run once in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  birth_date date,
  phone text not null default '',
  address text not null default '',
  interest text not null default '',
  contact_method text not null default '이메일',
  marketing_consent boolean not null default false,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'contact', name text not null, email text not null, phone text,
  product text, space text, budget text, width numeric, depth numeric, height numeric,
  wood text, color text, coating text, finish text, timeline text, preferred_contact text,
  message text, status text not null default '신규 문의', created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.production_items (
  id uuid primary key default gen_random_uuid(), title text not null, client text,
  start_date date not null, due_date date not null, status text not null, memo text,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_records (
  id uuid primary key default gen_random_uuid(), date date not null, type text not null check(type in ('revenue','expense')),
  title text not null, amount numeric not null check(amount >= 0), memo text, created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer
set search_path = public as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
  insert into public.profiles(id,email,name,birth_date,phone,address,interest,contact_method,marketing_consent)
  values(new.id,new.email,coalesce(new.raw_user_meta_data->>'name',''),nullif(new.raw_user_meta_data->>'birth_date','')::date,
    coalesce(new.raw_user_meta_data->>'phone',''),coalesce(new.raw_user_meta_data->>'address',''),
    coalesce(new.raw_user_meta_data->>'interest',''),coalesce(new.raw_user_meta_data->>'contact_method','이메일'),
    coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean,false)); return new; end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.production_items enable row level security;
alter table public.finance_records enable row level security;

create policy "profile own read" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
create policy "profile own update" on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid() and role='customer');
create policy "inquiry own insert" on public.inquiries for insert to authenticated with check (user_id=auth.uid());
create policy "inquiry own or admin read" on public.inquiries for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "inquiry admin update" on public.inquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "production admin all" on public.production_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "finance admin all" on public.finance_records for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.profiles, public.inquiries, public.production_items, public.finance_records from anon;
grant select,update on public.profiles to authenticated;
grant select,insert,update on public.inquiries to authenticated;
grant all on public.production_items, public.finance_records to authenticated;

-- After signing up with the owner's email, run once:
-- update public.profiles set role='admin' where email='mokkan504@gmail.com';
