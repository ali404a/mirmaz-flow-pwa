-- =====================================================================
-- mirmaz FLOW — مخطط قاعدة البيانات (Supabase / PostgreSQL)
-- الإصدار 2.0 — نسخة الإنتاج (بدون بيانات وهمية)
--
-- شغّل في: Supabase Dashboard > SQL Editor > New query
-- الترتيب الإلزامي: 01_schema.sql <- 02_permissions.sql <- 03_seed.sql
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- 1) الأنواع ----------
-- الأدوار: الإنجليزية هي المصدر الوحيد للحقيقة. العربية للعرض فقط.
do $$ begin
  create type user_role as enum (
    'super_admin','manager','coordinator','admin','reviewer',
    'caption_writer','designer','text_designer','editor'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type stage_state as enum
    ('pending','working','done','approval','approved','rejected','published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_priority as enum ('normal','medium','critical');
exception when duplicate_object then null; end $$;

-- أُضيف 'tick' (كان في الواجهة ومفقوداً من المخطط)
do $$ begin
  create type brand_kind as enum ('academy','zone','tick');
exception when duplicate_object then null; end $$;

-- أُضيف 'video' (المونتاج — كان في الواجهة ومفقوداً هنا)
do $$ begin
  create type stage_kind as enum
    ('caption','textdesign','design','video','review','approval','publish');
exception when duplicate_object then null; end $$;

-- ---------- 2) الملفات الشخصية ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null check (length(trim(full_name)) between 2 and 80),
  role         user_role not null default 'caption_writer',
  avatar_color text not null default '#2563EB'
                 check (avatar_color ~ '^#[0-9A-Fa-f]{6}$'),
  phone        text,
  telegram     text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- 3) الأقسام ----------
create table if not exists public.sections (
  id         uuid primary key default gen_random_uuid(),
  kind       stage_kind not null unique,
  name_ar    text not null,
  color      text not null default '#2563EB'
               check (color ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 4) المهام ----------
create table if not exists public.tasks (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (length(trim(title)) between 1 and 200),
  description    text not null default '',
  brand          brand_kind not null default 'academy',
  priority       task_priority not null default 'normal',
  due_date       date,
  is_partnership boolean not null default false,
  coordinator    uuid references public.profiles(id) on delete set null,
  coord_note     text not null default '',
  coord_link     text not null default '',
  created_by     uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------- 5) مراحل المهمة (الخريطة) ----------
create table if not exists public.stages (
  id            uuid primary key default gen_random_uuid(),
  task_id       uuid not null references public.tasks(id) on delete cascade,
  kind          stage_kind not null,
  assignee      uuid references public.profiles(id) on delete set null,
  state         stage_state not null default 'pending',
  sort_order    int not null default 0,
  text_content  text not null default '',
  note          text not null default '',
  link          text not null default '',
  reason        text not null default '',
  publish_date  date,
  publish_time  text check (publish_time is null or publish_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  -- سجل التدقيق: يُملأ بالـ trigger فقط، لا يُكتب من العميل
  last_edit_by  uuid references public.profiles(id) on delete set null,
  last_edit_at  timestamptz,
  needs_recheck boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ---------- 6) الإشعارات ----------
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade,  -- null = للجميع
  actor      uuid references public.profiles(id) on delete set null,
  type       text not null default 'assign'
               check (type in ('assign','approval','done','deadline','critical','reject')),
  title      text not null check (length(trim(title)) between 1 and 140),
  body       text not null default '',
  task_id    uuid references public.tasks(id) on delete cascade,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 7) المهام الشخصية ----------
create table if not exists public.personal_tasks (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null references public.profiles(id) on delete cascade,
  title      text not null check (length(trim(title)) between 1 and 200),
  details    text not null default '',
  is_done    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 8) المحادثة ----------
create table if not exists public.chat_channels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  icon       text not null default 'team',
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.chat_channels(id) on delete cascade,
  sender     uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

-- ---------- 9) الفهارس ----------
create index if not exists idx_stages_task     on public.stages(task_id);
create index if not exists idx_stages_assignee on public.stages(assignee);
create index if not exists idx_stages_state    on public.stages(state);
create index if not exists idx_stages_pubdate  on public.stages(publish_date) where publish_date is not null;
create index if not exists idx_tasks_brand     on public.tasks(brand);
create index if not exists idx_tasks_due       on public.tasks(due_date);
create index if not exists idx_notif_user      on public.notifications(user_id, is_read);
create index if not exists idx_chat_channel    on public.chat_messages(channel_id, created_at desc);
create index if not exists idx_personal_owner  on public.personal_tasks(owner);
create index if not exists idx_profiles_active on public.profiles(is_active) where is_active;

-- ---------- 10) updated_at تلقائياً ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists trg_touch_tasks on public.tasks;
create trigger trg_touch_tasks before update on public.tasks
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_profiles on public.profiles;
create trigger trg_touch_profiles before update on public.profiles
  for each row execute function public.touch_updated_at();
