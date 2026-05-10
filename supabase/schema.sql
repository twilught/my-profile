-- Supabase schema for portfolio works/projects
create table if not exists works (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique,
  title       text not null,
  description text,
  category    text,
  tags        text[] default '{}',
  image_url   text,
  link        text,
  github      text,
  year        int,
  date        text,
  featured    boolean default false,
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table works enable row level security;

-- Allow public read
create policy "Public read works"
  on works for select
  using (true);

-- Allow service role full access (used by server-side API routes)
create policy "Service role full access"
  on works for all
  using (auth.role() = 'service_role');
