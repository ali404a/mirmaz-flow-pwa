-- =====================================================================
-- mirmaz FLOW — البيانات الأولية (Seed)
-- الإصدار 2.0 — أقسام وقنوات فقط. صفر بيانات وهمية.
-- شغّل بعد 02_permissions.sql
-- =====================================================================

-- ---------- الأقسام (مراحل العمل) ----------
insert into public.sections (kind, name_ar, color, sort_order) values
  ('caption',    'كتابة الكابشن',     '#2563EB', 1),
  ('textdesign', 'تكست دزاين',        '#8B5CF6', 2),
  ('design',     'التصميم',           '#16B981', 3),
  ('video',      'المونتاج',          '#EAB308', 4),
  ('review',     'المراجعة والتدقيق', '#A1693C', 5),
  ('approval',   'طلب الموافقة',      '#F59E0B', 6),
  ('publish',    'النشر',             '#FF7BAC', 7)
on conflict (kind) do update
  set name_ar = excluded.name_ar,
      color   = excluded.color,
      sort_order = excluded.sort_order;

-- ---------- قنوات المحادثة ----------
insert into public.chat_channels (name, icon) values
  ('عام',            'team'),
  ('mirmaz Academy', 'home'),
  ('mirmaz Zone',    'flame'),
  ('mirmaz Tick',    'video'),
  ('التصاميم',       'design')
on conflict (name) do nothing;

-- =====================================================================
-- لا توجد مهام، ولا مستخدمون، ولا رسائل، ولا إشعارات وهمية.
-- الحسابات تُنشأ عبر 04_accounts.sql (خطوة واحدة).
-- =====================================================================
