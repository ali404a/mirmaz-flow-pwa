-- =====================================================================
-- mirmaz FLOW — مخطط قاعدة البيانات (Supabase / PostgreSQL)
-- الإصدار 1.0
-- شغّل هذا الملف كاملاً في: Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ---------- 1) الأدوار (التخصصات) ----------
-- نخزّن الدور كنص ثابت. القيم المسموحة:
--   super_admin | manager | coordinator | admin | reviewer
--   caption_writer | designer | text_designer | editor
create type user_role as enum (
  'super_admin',   -- السوبر أدمن: ينشئ كل شيء
  'manager',       -- المانيجر: يضيف موظفين/أقسام + يشوف كل شيء
  'coordinator',   -- الكوردنيتر: ينشئ المهام ويبني الخرائط
  'admin',         -- الإدارة: يوافق/يرفض
  'reviewer',      -- المدقق: يراجع قبل الموافقة
  'caption_writer',-- كاتب الكابشن
  'designer',      -- المصمم
  'text_designer', -- التكست دزاينر
  'editor'         -- المونتير
);

-- حالات المرحلة
create type stage_state as enum (
  'pending','working','done','approval','approved','rejected','published'
);

-- أولوية المهمة
create type task_priority as enum ('normal','medium','critical');

-- ---------- 2) جدول الملفات الشخصية (مرتبط بـ auth.users) ----------
-- Supabase ينشئ auth.users تلقائياً عند تسجيل الدخول.
-- هذا الجدول يضيف الدور والاسم لكل مستخدم.
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        user_role not null default 'caption_writer',
  avatar_color text default '#2F6BFF',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- 3) الأقسام (مراحل العمل المتاحة) ----------
create table public.sections (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null,           -- caption | textdesign | design | review | approval | publish
  name_ar    text not null,
  color      text default '#2F6BFF',
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- ---------- 4) المهام (التاسكات) ----------
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text default '',
  brand        text not null default 'academy',   -- academy | zone
  priority     task_priority not null default 'normal',
  due_date     date,
  coordinator  uuid references public.profiles(id),
  coord_note   text default '',
  coord_link   text default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- 5) مراحل المهمة (الخريطة) ----------
create table public.stages (
  id            uuid primary key default gen_random_uuid(),
  task_id       uuid not null references public.tasks(id) on delete cascade,
  kind          text not null,         -- نوع المرحلة
  assignee      uuid references public.profiles(id),  -- الشخص المعيّن
  state         stage_state not null default 'pending',
  sort_order    int not null default 0,
  text_content  text default '',       -- نص الكابشن/التصميم
  note          text default '',
  link          text default '',       -- رابط الملف (درايف/فيقما)
  reason        text default '',       -- سبب الرفض
  publish_date  date,
  publish_time  text default '',       -- ساعة النشر HH:MM
  -- سجل التعديل
  last_edit_by  uuid references public.profiles(id),
  last_edit_at  timestamptz,
  needs_recheck boolean default false,
  created_at    timestamptz not null default now()
);

-- ---------- 6) الإشعارات ----------
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade, -- null = للجميع
  type       text not null default 'assign',
  title      text not null,
  body       text default '',
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 7) المهام الشخصية (معزولة لكل مستخدم) ----------
create table public.personal_tasks (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  details    text default '',
  is_done    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 8) رسائل المحادثة ----------
create table public.chat_channels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  icon       text default 'team',
  created_at timestamptz not null default now()
);
create table public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.chat_channels(id) on delete cascade,
  sender     uuid not null references public.profiles(id),
  body       text not null,
  created_at timestamptz not null default now()
);

-- فهارس لتسريع الاستعلامات
create index idx_stages_task on public.stages(task_id);
create index idx_stages_assignee on public.stages(assignee);
create index idx_notif_user on public.notifications(user_id);
create index idx_chat_channel on public.chat_messages(channel_id);
create index idx_personal_owner on public.personal_tasks(owner);
