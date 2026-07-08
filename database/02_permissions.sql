-- =====================================================================
-- mirmaz FLOW — نظام الصلاحيات (Row Level Security)
-- شغّل هذا الملف بعد 01_schema.sql
-- هذا هو قلب نظام الصلاحيات: كل تخصص يشوف ويعدّل ما يخصّه فقط
-- =====================================================================

-- دالة مساعدة: ترجع دور المستخدم الحالي
create or replace function public.my_role()
returns user_role language sql stable security definer set search_path = public, pg_temp as $$
  select role from public.profiles where id = auth.uid()
$$;

-- دالة: هل المستخدم الحالي من الإدارة العليا؟
create or replace function public.is_admin_level()
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(
    (select role in ('super_admin','manager','admin','coordinator')
     from public.profiles where id = auth.uid()),
    false)
$$;

-- =====================================================================
-- تفعيل RLS على كل الجداول
-- =====================================================================
alter table public.profiles        enable row level security;
alter table public.sections        enable row level security;
alter table public.tasks           enable row level security;
alter table public.stages          enable row level security;
alter table public.notifications   enable row level security;
alter table public.personal_tasks  enable row level security;
alter table public.chat_channels   enable row level security;
alter table public.chat_messages   enable row level security;

-- =====================================================================
-- profiles: الكل يقرأ الأسماء، فقط السوبر أدمن/المانيجر يعدّل
-- =====================================================================
create policy "قراءة الملفات للجميع المسجّلين"
  on public.profiles for select to authenticated using (true);

create policy "السوبر أدمن ينشئ حسابات"
  on public.profiles for insert to authenticated
  with check (my_role() in ('super_admin','manager'));

-- المستخدم يعدّل اسمه/لونه فقط — لا يغيّر دوره (منع ترقية الصلاحيات)
-- WITH CHECK يضمن أن الدور الجديد = الدور القديم لغير الأدمن
create policy "السوبر أدمن يعدّل الحسابات"
  on public.profiles for update to authenticated
  using (my_role() in ('super_admin','manager') or id = auth.uid())
  with check (
    my_role() in ('super_admin','manager')   -- الأدمن يغيّر أي شيء
    or (
      id = auth.uid()                          -- المستخدم العادي:
      and role = (select role from public.profiles where id = auth.uid())  -- لا يغيّر دوره
      and is_active = (select is_active from public.profiles where id = auth.uid()) -- لا يفعّل/يعطّل نفسه
    )
  );

-- منع إضافي صارم: لا أحد يرفع نفسه لسوبر أدمن إطلاقاً عبر التطبيق
-- (إنشاء السوبر أدمن يتم فقط يدوياً من لوحة Supabase)
create or replace function public.prevent_self_elevation()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  -- إذا تغيّر الدور وكان المنفّذ هو صاحب الحساب نفسه وليس سوبر أدمن
  if (new.role is distinct from old.role)
     and auth.uid() = new.id
     and (select role from public.profiles where id = auth.uid()) <> 'super_admin' then
    raise exception 'لا يمكنك تغيير دورك بنفسك';
  end if;
  -- لا أحد عدا السوبر أدمن يصنع سوبر أدمن
  if new.role = 'super_admin' and old.role <> 'super_admin'
     and (select role from public.profiles where id = auth.uid()) <> 'super_admin' then
    raise exception 'فقط السوبر أدمن يمنح هذا الدور';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_prevent_elevation on public.profiles;
create trigger trg_prevent_elevation
  before update on public.profiles
  for each row execute function public.prevent_self_elevation();

create policy "السوبر أدمن يحذف الحسابات"
  on public.profiles for delete to authenticated
  using (my_role() = 'super_admin');

-- =====================================================================
-- sections: الكل يقرأ، المانيجر/السوبر أدمن يضيف/يحذف
-- =====================================================================
create policy "قراءة الأقسام للجميع"
  on public.sections for select to authenticated using (true);
create policy "المانيجر يدير الأقسام"
  on public.sections for all to authenticated
  using (my_role() in ('super_admin','manager'))
  with check (my_role() in ('super_admin','manager'));

-- =====================================================================
-- tasks: الكل يقرأ المهام، الكوردنيتر/المانيجر ينشئ ويعدّل
-- =====================================================================
create policy "قراءة المهام للجميع"
  on public.tasks for select to authenticated using (true);
create policy "الكوردنيتر ينشئ المهام"
  on public.tasks for insert to authenticated
  with check (my_role() in ('super_admin','manager','coordinator'));
create policy "الكوردنيتر يعدّل المهام"
  on public.tasks for update to authenticated
  using (my_role() in ('super_admin','manager','coordinator'));
create policy "حذف المهام للإدارة"
  on public.tasks for delete to authenticated
  using (my_role() in ('super_admin','manager','coordinator'));

-- =====================================================================
-- stages: الكل يقرأ. التعديل:
--   - المعيّن على المرحلة يعدّل مرحلته
--   - الكوردنيتر/المانيجر يعدّل أي مرحلة
--   - الإدارة تعدّل (للموافقة/الرفض)
-- =====================================================================
create policy "قراءة المراحل للجميع"
  on public.stages for select to authenticated using (true);

create policy "إنشاء المراحل للكوردنيتر"
  on public.stages for insert to authenticated
  with check (my_role() in ('super_admin','manager','coordinator'));

create policy "تعديل المرحلة للمعيّن أو الكوردنيتر أو الإدارة"
  on public.stages for update to authenticated
  using (
    assignee = auth.uid()                                  -- صاحب المرحلة
    or my_role() in ('super_admin','manager','coordinator','admin','reviewer')
  );

create policy "حذف المراحل للكوردنيتر"
  on public.stages for delete to authenticated
  using (my_role() in ('super_admin','manager','coordinator'));

-- =====================================================================
-- notifications: كل مستخدم يشوف إشعاراته (أو العامة null)
-- =====================================================================
create policy "قراءة الإشعارات الخاصة بي"
  on public.notifications for select to authenticated
  using (user_id = auth.uid() or user_id is null);
create policy "إنشاء إشعار"
  on public.notifications for insert to authenticated with check (true);
create policy "تعليم إشعاري كمقروء"
  on public.notifications for update to authenticated
  using (user_id = auth.uid() or user_id is null);

-- =====================================================================
-- personal_tasks: معزولة تماماً — كل مستخدم يرى مهامه فقط
-- =====================================================================
create policy "مهامي الخاصة لي وحدي - قراءة"
  on public.personal_tasks for select to authenticated
  using (owner = auth.uid());
create policy "مهامي الخاصة لي وحدي - كتابة"
  on public.personal_tasks for all to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

-- =====================================================================
-- chat: كل المسجّلين يقرأون ويرسلون
-- =====================================================================
create policy "قراءة القنوات" on public.chat_channels
  for select to authenticated using (true);
create policy "إدارة القنوات للمانيجر" on public.chat_channels
  for all to authenticated
  using (my_role() in ('super_admin','manager'))
  with check (my_role() in ('super_admin','manager'));
create policy "قراءة الرسائل" on public.chat_messages
  for select to authenticated using (true);
create policy "إرسال رسالة" on public.chat_messages
  for insert to authenticated with check (sender = auth.uid());

-- =====================================================================
-- Trigger: عند إنشاء مستخدم جديد في auth، أنشئ له profile تلقائياً
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'caption_writer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- حماية منطق العمل: عند تعديل مرحلة، أعِد المراحل التالية للتدقيق تلقائياً
-- (يُفرض على مستوى قاعدة البيانات — لا يمكن تجاوزه من الواجهة)
-- =====================================================================
create or replace function public.revert_downstream_on_edit()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  -- إذا تغيّر محتوى مرحلة عمل (نص/ملاحظة/رابط) وكانت منجزة سابقاً
  if (new.text_content is distinct from old.text_content
      or new.note is distinct from old.note
      or new.link is distinct from old.link)
     and new.kind not in ('approval','publish')
  then
    -- أعِد كل المراحل التالية (مراجعة/موافقة/نشر) للانتظار
    update public.stages
      set state = 'pending', needs_recheck = true, reason = ''
      where task_id = new.task_id
        and sort_order > new.sort_order
        and (kind in ('review','approval','publish') or state in ('done','approved','published'));
    -- سجّل من عدّل ومتى
    new.last_edit_by := auth.uid();
    new.last_edit_at := now();
    new.state := 'working';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_revert_downstream on public.stages;
create trigger trg_revert_downstream
  before update on public.stages
  for each row execute function public.revert_downstream_on_edit();

-- منع تزوير حقل "آخر تعديل": دائماً = المستخدم الحالي (يُضبط بالـ trigger أعلاه)
-- ومنع تغيير coordinator/المنشئ بعد الإنشاء يتم عبر سياسات التطبيق.
