-- ZEB-Construction Managemant: initial multi-project database
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '',
 role text not null default 'admin',
 is_active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.projects (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 location text,
 status text not null default 'active' check(status in ('active','on_hold','completed','archived')),
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);
create table if not exists public.project_members (
 project_id uuid references public.projects(id) on delete cascade,
 user_id uuid references auth.users(id) on delete cascade,
 access_role text not null default 'member',
 primary key(project_id,user_id)
);
create table if not exists public.vendors (
 id uuid primary key default gen_random_uuid(),
 project_id uuid references public.projects(id) on delete cascade,
 name text not null, category text, phone text, address text,
 created_at timestamptz not null default now()
);
create table if not exists public.materials (
 id uuid primary key default gen_random_uuid(),
 project_id uuid references public.projects(id) on delete cascade,
 name text not null, unit text not null default 'unit',
 quantity numeric(14,3) not null default 0, unit_cost numeric(14,2) not null default 0,
 created_at timestamptz not null default now()
);
create table if not exists public.contractors (
 id uuid primary key default gen_random_uuid(),
 project_id uuid references public.projects(id) on delete cascade,
 name text not null, trade text, rate numeric(14,2) not null default 0, rate_unit text,
 phone text, created_at timestamptz not null default now()
);
create table if not exists public.transactions (
 id uuid primary key default gen_random_uuid(),
 project_id uuid references public.projects(id) on delete cascade,
 txn_date date not null default current_date,
 txn_type text not null check(txn_type in ('owner_fund','expense','vendor_payment','contractor_payment','labour_payment','other')),
 party_name text, description text, amount numeric(14,2) not null check(amount>=0),
 payment_method text, voucher_no text, created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);
create table if not exists public.daily_progress (
 id uuid primary key default gen_random_uuid(),
 project_id uuid references public.projects(id) on delete cascade,
 work_date date not null default current_date,
 floor_name text, stage text, description text not null,
 workers_count integer not null default 0, completed_quantity numeric(14,3), unit text,
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 submitted_by uuid references auth.users(id), reviewed_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);
create table if not exists public.vouchers (
 id uuid primary key default gen_random_uuid(),
 project_id uuid references public.projects(id) on delete cascade,
 voucher_no text not null, voucher_type text not null,
 voucher_date date not null default current_date, party_name text,
 amount numeric(14,2) not null default 0, description text,
 created_by uuid references auth.users(id), created_at timestamptz not null default now(),
 unique(project_id,voucher_no)
);
create or replace function public.is_project_member(pid uuid)
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from project_members pm where pm.project_id=pid and pm.user_id=auth.uid())
or exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('admin','owner') and p.is_active=true); $$;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.vendors enable row level security;
alter table public.materials enable row level security;
alter table public.contractors enable row level security;
alter table public.transactions enable row level security;
alter table public.daily_progress enable row level security;
alter table public.vouchers enable row level security;
drop policy if exists "profile self read" on profiles;
create policy "profile self read" on profiles for select using(id=auth.uid());
drop policy if exists "projects member read" on projects;
create policy "projects member read" on projects for select using(public.is_project_member(id));
drop policy if exists "projects admin insert" on projects;
create policy "projects admin insert" on projects for insert with check(auth.uid()=created_by or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "projects admin update" on projects;
create policy "projects admin update" on projects for update using(exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
do $$ declare t text; begin
 foreach t in array array['vendors','materials','contractors','transactions','daily_progress','vouchers'] loop
  execute format('drop policy if exists "project member all %1$s" on public.%1$I',t);
  execute format('create policy "project member all %1$s" on public.%1$I for all using(public.is_project_member(project_id)) with check(public.is_project_member(project_id))',t);
 end loop;
end $$;
drop policy if exists "membership self or admin read" on project_members;
create policy "membership self or admin read" on project_members for select using(user_id=auth.uid() or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
-- Initial setup: after creating the first Auth user, insert its profile:
-- insert into public.profiles(id,full_name,role) values ('AUTH_USER_UUID','Aslam Zeb','admin');
