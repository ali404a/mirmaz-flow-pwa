-- =====================================================================
-- mirmaz FLOW — نظام الصلاحيات (Row Level Security)
-- الإصدار 2.0 — مُصلَح أمنياً
--
-- شغّل بعد 01_schema.sql
--
-- ما أُصلح مقارنة بالإصدار 1.0:
--   1) stages: أُضيف WITH CHECK (كان USING فقط -> نقل المرحلة لمهمة أخرى)
--   2) notifications: منع الانتحال (كان with check (true) للجميع)
--   3) reviewer: أُخرج من مسار الموافقة (كان يستطيع الاعتماد)
--   4) handle_new_user: لا يقرأ الدور من metadata العميل إطلاقاً
--   5) prevent_self_elevation: يمنع المانيجر من صنع سوبر أدمن
--   6) revert_downstream: لا يلمس مراحل الموافقة/النشر بالخطأ
-- =====================================================================

-- ---------- دوال مساعدة ----------
-- ملاحظة: security definer + search_path مثبّت = محصّنة ضد الـ hijacking
create or replace function public.my_role()
returns user_role language sql stable security definer
set search_path = public, pg_temp as $$
  select role from public.profiles where id = auth.uid() and is_active
$$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select coalesce((select is_active from public.profiles where id = auth.uid()), false)
$$;

-- من يدير الحسابات؟ (السوبر أدمن والمانيجر فقط)
create or replace function public.can_manage_users()
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select coalesce((select role in ('super_admin','manager')
                   from public.profiles where id = auth.uid() and is_active), false)
$$;

-- من يبني المهام والخرائط؟
create or replace function public.can_build_tasks()
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select coalesce((select role in ('super_admin','manager','coordinator')
                   from public.profiles where id = auth.uid() and is_active), false)
$$;

-- من يوافق/يرفض؟ (الإدارة والسوبر أدمن فقط — المدقق ليس منهم)
create or replace function public.can_approve()
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select coalesce((select role in ('super_admin','admin')
                   from public.profiles where id = auth.uid() and is_active), false)
$$;

revoke execute on function public.my_role()         from anon;
revoke execute on function public.can_manage_users() from anon;
revoke execute on function public.can_build_tasks()  from anon;
revoke execute on function public.can_approve()      from anon;

-- ---------- تنظيف السياسات القديمة (يجعل الملف قابلاً لإعادة التشغيل) ----------
-- سياسات الإصدار 1.0 بأسمائها العربية
drop policy if exists "قراءة الملفات للجميع المسجّلين" on public.profiles;
drop policy if exists "السوبر أدمن ينشئ حسابات" on public.profiles;
drop policy if exists "السوبر أدمن يعدّل الحسابات" on public.profiles;
drop policy if exists "السوبر أدمن يحذف الحسابات" on public.profiles;
drop policy if exists "قراءة الأقسام للجميع" on public.sections;
drop policy if exists "المانيجر يدير الأقسام" on public.sections;
drop policy if exists "قراءة المهام للجميع" on public.tasks;
drop policy if exists "الكوردنيتر ينشئ المهام" on public.tasks;
drop policy if exists "الكوردنيتر يعدّل المهام" on public.tasks;
drop policy if exists "حذف المهام للإدارة" on public.tasks;
drop policy if exists "قراءة المراحل للجميع" on public.stages;
drop policy if exists "إنشاء المراحل للكوردنيتر" on public.stages;
drop policy if exists "تعديل المرحلة للمعيّن أو الكوردنيتر أو الإدارة" on public.stages;
drop policy if exists "حذف المراحل للكوردنيتر" on public.stages;
drop policy if exists "قراءة الإشعارات الخاصة بي" on public.notifications;
drop policy if exists "إنشاء إشعار" on public.notifications;
drop policy if exists "تعليم إشعاري كمقروء" on public.notifications;
drop policy if exists "مهامي الخاصة لي وحدي - قراءة" on public.personal_tasks;
drop policy if exists "مهامي الخاصة لي وحدي - كتابة" on public.personal_tasks;
drop policy if exists "قراءة القنوات" on public.chat_channels;
drop policy if exists "إدارة القنوات للمانيجر" on public.chat_channels;
drop policy if exists "قراءة الرسائل" on public.chat_messages;
drop policy if exists "إرسال رسالة" on public.chat_messages;

-- سياسات الإصدار 2.0 (لإعادة التشغيل)
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "profiles_delete" on public.profiles;
drop policy if exists "sections_select" on public.sections;
drop policy if exists "sections_write" on public.sections;
drop policy if exists "tasks_select" on public.tasks;
drop policy if exists "tasks_insert" on public.tasks;
drop policy if exists "tasks_update" on public.tasks;
drop policy if exists "tasks_delete" on public.tasks;
drop policy if exists "stages_select" on public.stages;
drop policy if exists "stages_insert" on public.stages;
drop policy if exists "stages_update" on public.stages;
drop policy if exists "stages_delete" on public.stages;
drop policy if exists "notif_select" on public.notifications;
drop policy if exists "notif_insert" on public.notifications;
drop policy if exists "notif_update" on public.notifications;
drop policy if exists "notif_delete" on public.notifications;
drop policy if exists "personal_all" on public.personal_tasks;
drop policy if exists "chan_select" on public.chat_channels;
drop policy if exists "chan_write" on public.chat_channels;
drop policy if exists "msg_select" on public.chat_messages;
drop policy if exists "msg_insert" on public.chat_messages;
drop policy if exists "msg_delete" on public.chat_messages;

-- ---------- تفعيل RLS ----------
alter table public.profiles       enable row level security;
alter table public.sections       enable row level security;
alter table public.tasks          enable row level security;
alter table public.stages         enable row level security;
alter table public.notifications  enable row level security;
alter table public.personal_tasks enable row level security;
alter table public.chat_channels  enable row level security;
alter table public.chat_messages  enable row level security;

-- إجبار RLS حتى على مالك الجدول (حماية إضافية)
alter table public.profiles       force row level security;
alter table public.personal_tasks force row level security;

-- =====================================================================
-- profiles
-- =====================================================================
create policy "profiles_select" on public.profiles
  for select to authenticated using ((select is_active_user()));

create policy "profiles_insert" on public.profiles
  for insert to authenticated with check ((select can_manage_users()));

-- المستخدم يعدّل اسمه/لونه فقط. الأدمن يعدّل أي شيء.
create policy "profiles_update" on public.profiles
  for update to authenticated
  using ((select can_manage_users()) or (id = (select auth.uid()) and is_active))
  with check ((select can_manage_users()) or id = (select auth.uid()));

-- ملاحظة: منع المستخدم من تغيير دوره/تفعيل نفسه يتم في trigger
-- (prevent_self_elevation) وليس في WITH CHECK — الاستعلام عن public.profiles
-- داخل سياسة على profiles يسبّب "infinite recursion".

create policy "profiles_delete" on public.profiles
  for delete to authenticated
  using ((select my_role()) = 'super_admin' and id <> auth.uid());  -- لا يحذف نفسه

-- ---------- منع ترقية الصلاحيات (مُشدَّد) ----------
create or replace function public.prevent_self_elevation()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
declare
  caller_role user_role;
  is_mgr      boolean;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  is_mgr := coalesce(caller_role in ('super_admin','manager'), false);

  -- (أ) المستخدم العادي لا يغيّر دوره ولا حالة تفعيله
  --     (يُفرض هنا لأن WITH CHECK لا يقرأ public.profiles بلا recursion)
  if not is_mgr and auth.uid() = new.id then
    if new.role is distinct from old.role then
      raise exception 'لا يمكنك تغيير دورك بنفسك';
    end if;
    if new.is_active is distinct from old.is_active then
      raise exception 'لا يمكنك تفعيل أو تعطيل حسابك';
    end if;
  end if;

  -- (ب) لا أحد يغيّر دوره بنفسه — ولا حتى الأدمن (يمنع القفل الذاتي)
  if (new.role is distinct from old.role) and auth.uid() = new.id then
    raise exception 'لا يمكنك تغيير دورك بنفسك';
  end if;

  -- (ج) فقط السوبر أدمن يمنح أو ينزع دور السوبر أدمن
  if (new.role = 'super_admin' or old.role = 'super_admin')
     and (new.role is distinct from old.role)
     and coalesce(caller_role,'editor') <> 'super_admin' then
    raise exception 'فقط السوبر أدمن يمنح أو ينزع هذا الدور';
  end if;

  -- (د) المانيجر لا يصنع مانيجر آخر (تصعيد أفقي)
  if new.role = 'manager' and old.role is distinct from 'manager'
     and coalesce(caller_role,'editor') = 'manager' then
    raise exception 'المانيجر لا يستطيع إنشاء مانيجر آخر';
  end if;

  -- (هـ) لا أحد يعطّل السوبر أدمن غير سوبر أدمن
  if old.role = 'super_admin' and new.is_active = false
     and coalesce(caller_role,'editor') <> 'super_admin' then
    raise exception 'لا يمكن تعطيل حساب السوبر أدمن';
  end if;

  return new;
end; $$;

drop trigger if exists trg_prevent_elevation on public.profiles;
create trigger trg_prevent_elevation
  before update on public.profiles
  for each row execute function public.prevent_self_elevation();

-- =====================================================================
-- sections
-- =====================================================================
create policy "sections_select" on public.sections
  for select to authenticated using ((select is_active_user()));

create policy "sections_write" on public.sections
  for all to authenticated
  using ((select can_manage_users())) with check ((select can_manage_users()));

-- =====================================================================
-- tasks
-- =====================================================================
create policy "tasks_select" on public.tasks
  for select to authenticated using ((select is_active_user()));

create policy "tasks_insert" on public.tasks
  for insert to authenticated with check ((select can_build_tasks()));

create policy "tasks_update" on public.tasks
  for update to authenticated
  using ((select can_build_tasks())) with check ((select can_build_tasks()));

create policy "tasks_delete" on public.tasks
  for delete to authenticated
  using ((select my_role()) in ('super_admin','manager','coordinator'));

-- =====================================================================
-- stages  — القلب الأمني
-- =====================================================================
create policy "stages_select" on public.stages
  for select to authenticated using ((select is_active_user()));

create policy "stages_insert" on public.stages
  for insert to authenticated with check ((select can_build_tasks()));

-- الإصلاح الجوهري: USING يحدد "أي صف تلمس"، WITH CHECK يحدد "لأي شكل تتركه".
-- بدون WITH CHECK كان المعيَّن ينقل المرحلة لمهمة أخرى أو يغيّر assignee لنفسه.
create policy "stages_update" on public.stages
  for update to authenticated
  using (
    (select is_active_user()) and (
      assignee = (select auth.uid())
      or (select can_build_tasks())
      or (select can_approve())
      or (select my_role()) = 'reviewer'
    )
  )
  with check (
    (select is_active_user()) and (
      (select can_build_tasks())
      or (select can_approve())
      or (select my_role()) = 'reviewer'
      or assignee = (select auth.uid())
    )
  );

-- ملاحظة: مقارنة القيم القديمة بالجديدة تتم في trigger (guard_stage_transition)
-- وليس في WITH CHECK. الاستعلام عن public.stages داخل سياسة على stages
-- يسبّب "infinite recursion" — لذلك النقل/إعادة التعيين يُمنع في الـtrigger.

create policy "stages_delete" on public.stages
  for delete to authenticated using ((select can_build_tasks()));

-- ---------- حارس الاعتماد: من يملك تغيير الحالة لِـ approved/rejected ----------
create or replace function public.guard_stage_transition()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
declare
  v_can_build boolean := public.can_build_tasks();
  v_can_appr  boolean := public.can_approve();
  v_role      user_role := public.my_role();
begin
  -- (أ) المعيَّن العادي لا ينقل المرحلة لمهمة أخرى ولا يغيّر نوعها/ترتيبها
  --     ولا يعيد تعيينها لشخص آخر. (يُفرض هنا لأن WITH CHECK لا يستطيع
  --     قراءة public.stages بلا recursion)
  if not (v_can_build or v_can_appr) then
    if new.task_id    is distinct from old.task_id
       or new.kind    is distinct from old.kind
       or new.sort_order is distinct from old.sort_order then
      raise exception 'لا يمكنك نقل المرحلة أو تغيير نوعها';
    end if;
    if new.assignee is distinct from old.assignee then
      raise exception 'لا يمكنك إعادة تعيين المرحلة';
    end if;
  end if;

  -- (ب) الاعتماد/الرفض حكرٌ على الإدارة والسوبر أدمن
  if new.state in ('approved','rejected')
     and old.state is distinct from new.state
     and not v_can_appr then
    raise exception 'الموافقة والرفض من صلاحية الإدارة فقط';
  end if;

  -- (ج) النشر لا يُفتح قبل اعتماد مرحلة الموافقة في نفس المهمة
  if new.state = 'published' and old.state is distinct from 'published' then
    if exists (select 1 from public.stages s
               where s.task_id = new.task_id and s.kind = 'approval'
                 and s.state <> 'approved') then
      raise exception 'لا يمكن النشر قبل موافقة الإدارة';
    end if;
  end if;

  -- (د) منع تزوير سجل التدقيق: يُفرض دائماً من الخادم
  new.last_edit_by := auth.uid();
  new.last_edit_at := now();
  return new;
end; $$;

drop trigger if exists trg_guard_stage on public.stages;
create trigger trg_guard_stage
  before update on public.stages
  for each row execute function public.guard_stage_transition();

-- ---------- إعادة المراحل التالية للتدقيق عند أي تعديل ----------
create or replace function public.revert_downstream_on_edit()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  if (new.text_content is distinct from old.text_content
      or new.note is distinct from old.note
      or new.link is distinct from old.link)
     and new.kind not in ('approval','publish')
  then
    update public.stages
       set state = 'pending', needs_recheck = true, reason = ''
     where task_id = new.task_id
       and sort_order > new.sort_order
       and (kind in ('review','approval','publish')
            or state in ('done','approved','published'));

    -- لا نُجبر الحالة على working إن كان المحرّر ينهي المرحلة فعلاً
    if new.state = old.state then
      new.state := 'working';
    end if;
  end if;
  return new;
end; $$;

drop trigger if exists trg_revert_downstream on public.stages;
create trigger trg_revert_downstream
  after update on public.stages
  for each row execute function public.revert_downstream_on_edit();

-- =====================================================================
-- notifications — منع الانتحال
-- =====================================================================
create policy "notif_select" on public.notifications
  for select to authenticated
  using ((select is_active_user()) and (user_id = auth.uid() or user_id is null));

-- كان: with check (true) => أي مستخدم يرسل إشعاراً باسم أي أحد.
-- الآن: يجب أن يكون المرسِل هو نفسه، والإشعارات العامة للإدارة فقط.
create policy "notif_insert" on public.notifications
  for insert to authenticated
  with check (
    (select is_active_user())
    and actor = auth.uid()
    and (user_id is not null or (select can_build_tasks()))
  );

create policy "notif_update" on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notif_delete" on public.notifications
  for delete to authenticated using (user_id = auth.uid());

-- =====================================================================
-- personal_tasks — معزولة تماماً
-- =====================================================================
create policy "personal_all" on public.personal_tasks
  for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());

-- =====================================================================
-- chat
-- =====================================================================
create policy "chan_select" on public.chat_channels
  for select to authenticated using ((select is_active_user()));

create policy "chan_write" on public.chat_channels
  for all to authenticated
  using ((select can_manage_users())) with check ((select can_manage_users()));

create policy "msg_select" on public.chat_messages
  for select to authenticated using ((select is_active_user()));

create policy "msg_insert" on public.chat_messages
  for insert to authenticated
  with check ((select is_active_user()) and sender = auth.uid());

-- المستخدم يحذف رسالته فقط (لا تعديل — يحفظ نزاهة السجل)
create policy "msg_delete" on public.chat_messages
  for delete to authenticated
  using (sender = auth.uid() or (select can_manage_users()));

-- =====================================================================
-- إنشاء profile تلقائياً عند إنشاء مستخدم في auth
-- =====================================================================
-- الإصلاح: لا نقرأ الدور من raw_user_meta_data إطلاقاً.
-- العميل يتحكم بذلك الحقل عند signUp -> كان يعني اختيار دورك بنفسك.
-- الدور يُضبط حصراً عبر Edge Function بمفتاح الخدمة، أو يدوياً.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'),''),
             split_part(new.email,'@',1)),
    'caption_writer'   -- أدنى دور دائماً. الترقية تتم بخطوة منفصلة محكومة.
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- إغلاق الصلاحيات العامة ----------
revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from anon;
