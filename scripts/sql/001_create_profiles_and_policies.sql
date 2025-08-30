-- Create profiles table keyed to Supabase auth users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  bio text,
  avatar_url text,
  skills text[] default '{}',
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public read profiles'
  ) then
    create policy "Public read profiles"
      on public.profiles for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Insert own profile'
  ) then
    create policy "Insert own profile"
      on public.profiles for insert
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Update own profile'
  ) then
    create policy "Update own profile"
      on public.profiles for update
      using (auth.uid() = id);
  end if;
end $$;

-- Helpful index for lookups
create index if not exists profiles_updated_at_idx on public.profiles (updated_at desc);
