-- Kitbox (Appteka clone) — initial schema
-- Postgres (Supabase). Times are timestamptz/UTC throughout. No money columns — app is free.

create extension if not exists pgcrypto;

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table apps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  package_name text not null unique,
  short_description text not null,
  long_description text,
  category text not null,
  is_open_source boolean not null default false,
  icon_url text,
  current_version_id uuid, -- fk added below, after app_versions exists
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on apps (owner_id);
create index on apps (category);
-- full-text search over name + short description (S03 search)
alter table apps add column search_tsv tsvector
  generated always as (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(short_description,''))) stored;
create index apps_search_idx on apps using gin (search_tsv);

create table app_versions (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references apps(id) on delete cascade,
  version_name text not null,
  version_code integer not null,
  changelog text,
  apk_url text not null,
  size_bytes bigint not null,
  scan_status text not null default 'pending'
    check (scan_status in ('pending', 'clean', 'flagged')),
  uploaded_at timestamptz not null default now(),
  unique (app_id, version_code)
);
create index on app_versions (app_id, version_code desc);

alter table apps
  add constraint apps_current_version_fk
  foreign key (current_version_id) references app_versions(id) on delete set null;

create table reviews (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references apps(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (app_id, user_id) -- one review per user per app; re-submitting is an update
);
create index on reviews (app_id);

create table favorites (
  user_id uuid not null references users(id) on delete cascade,
  app_id uuid not null references apps(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, app_id)
);
create index on favorites (app_id);

create table topics (
  id uuid primary key default gen_random_uuid(),
  app_id uuid references apps(id) on delete cascade, -- null = global topic
  title text not null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on topics (app_id);

create table messages (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index on messages (topic_id, created_at);

create table downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  app_id uuid not null references apps(id) on delete cascade,
  version_id uuid not null references app_versions(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);
create index on downloads (app_id, downloaded_at);
create index on downloads (user_id, downloaded_at);

-- Row level security (Supabase). Public read on the catalogue, writes scoped to the owner/author.
alter table apps enable row level security;
alter table app_versions enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table topics enable row level security;
alter table messages enable row level security;
alter table downloads enable row level security;

create policy "apps are publicly readable" on apps for select using (true);
create policy "owner manages own apps" on apps for all using (auth.uid() = owner_id);

create policy "versions are publicly readable" on app_versions for select using (true);
create policy "app owner manages versions" on app_versions for insert with check (
  auth.uid() = (select owner_id from apps where apps.id = app_id)
);

create policy "reviews are publicly readable" on reviews for select using (true);
create policy "user manages own review" on reviews for all using (auth.uid() = user_id);

create policy "user manages own favorites" on favorites for all using (auth.uid() = user_id);

create policy "topics are publicly readable" on topics for select using (true);
create policy "authenticated users create topics" on topics for insert with check (auth.uid() is not null);

create policy "messages are publicly readable" on messages for select using (true);
create policy "authenticated users post messages" on messages for insert with check (auth.uid() = user_id);

create policy "user manages own downloads" on downloads for all using (auth.uid() = user_id);
