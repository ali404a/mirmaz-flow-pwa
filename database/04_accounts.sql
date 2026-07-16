-- =====================================================================
-- mirmaz FLOW — ترقية الحسابات إلى أدوارها
-- الإصدار 2.0
--
-- ما يفعله هذا الملف: يضبط الاسم والدور لحسابات أنشأتَها أنت مسبقاً.
-- ما لا يفعله: لا ينشئ كلمات مرور. أنت تضبطها في Supabase.
--
-- =====================================================================
-- الخطوة 1 — أنشئ الحسابات من لوحة Supabase (يدوياً، مرة واحدة):
--   Authentication > Users > Add user  (فعّل Auto Confirm User)
--
--   البريد                          الشخص            الدور المستهدف
--   ------------------------------  ---------------  ----------------
--   ali@mirmaz.com                  علي              super_admin
--   yasmin@mirmaz.com               ياسمين حاكم       coordinator
--
--   كلمة المرور: اضغط "Generate a password" ليولّدها Supabase عشوائياً،
--   أو ولّدها بنفسك:  openssl rand -base64 18
--   سلّمها للشخص عبر قناة آمنة (لا واتساب، لا إيميل عادي).
--
-- الخطوة 2 — شغّل هذا الملف. يجد الحسابات بالبريد ويضبط أدوارها.
-- =====================================================================

-- ملاحظة أمنية: نعطّل حارس الترقية مؤقتاً داخل هذه المعاملة فقط.
-- هذا آمن لأن الملف يُشغَّل من SQL Editor بمفتاح الخدمة (لا auth.uid())،
-- وهو الطريق الوحيد لتأسيس أول سوبر أدمن. الحارس يعود فوراً بعدها.
alter table public.profiles disable trigger trg_prevent_elevation;

do $$
declare
  v_ali    uuid;
  v_yasmin uuid;
begin
  select id into v_ali    from auth.users where lower(email) = 'ali@mirmaz.com';
  select id into v_yasmin from auth.users where lower(email) = 'yasmin@mirmaz.com';

  if v_ali is null then
    raise exception 'لم يُعثر على ali@mirmaz.com — أنشئه أولاً من Authentication > Users';
  end if;
  if v_yasmin is null then
    raise exception 'لم يُعثر على yasmin@mirmaz.com — أنشئه أولاً من Authentication > Users';
  end if;

  -- السوبر أدمن: علي
  insert into public.profiles (id, full_name, role, avatar_color, is_active)
  values (v_ali, 'علي', 'super_admin', '#2563EB', true)
  on conflict (id) do update
    set full_name = excluded.full_name,
        role      = excluded.role,
        is_active = true;

  -- الكوردنيتر: ياسمين حاكم
  insert into public.profiles (id, full_name, role, avatar_color, is_active)
  values (v_yasmin, 'ياسمين حاكم', 'coordinator', '#7C3AED', true)
  on conflict (id) do update
    set full_name = excluded.full_name,
        role      = excluded.role,
        is_active = true;

  raise notice 'تم: علي = super_admin | ياسمين حاكم = coordinator';
  raise notice 'بقية الفريق (الإدارة/المانيجر/المصمم/...) يُنشئها علي من داخل التطبيق.';
end $$;

-- إعادة تفعيل الحارس — إلزامي
alter table public.profiles enable trigger trg_prevent_elevation;

-- ---------- تحقّق ----------
select p.full_name, p.role, u.email, p.is_active
from public.profiles p
join auth.users u on u.id = p.id
order by
  case p.role
    when 'super_admin' then 1 when 'manager' then 2
    when 'coordinator' then 3 when 'admin' then 4 else 5
  end;
