-- =====================================================================
-- mirmaz FLOW — البيانات الأولية (Seed)
-- شغّل هذا بعد 02_permissions.sql
-- =====================================================================

-- الأقسام الافتراضية (مراحل العمل)
insert into public.sections (kind, name_ar, color, sort_order) values
  ('caption',    'كتابة الكابشن',     '#2F6BFF', 1),
  ('textdesign', 'تكست دزاين',        '#8B5CF6', 2),
  ('design',     'التصميم',           '#21C07A', 3),
  ('review',     'المراجعة والتدقيق', '#A1693C', 4),
  ('approval',   'طلب الموافقة',      '#F6A609', 5),
  ('publish',    'النشر',             '#FF7BAC', 6)
on conflict do nothing;

-- قنوات المحادثة الافتراضية
insert into public.chat_channels (name, icon) values
  ('عام',            'team'),
  ('mirmaz Academy', 'home'),
  ('mirmaz Zone',    'flame'),
  ('التصاميم',       'design')
on conflict do nothing;

-- =====================================================================
-- إنشاء السوبر أدمن:
-- الطريقة الصحيحة (خطوتان):
--   1) من Supabase Dashboard > Authentication > Users > Add user
--      أنشئ مستخدماً بإيميلك وكلمة مرور.
--   2) انسخ الـ UUID الخاص به، ثم شغّل التحديث التالي (بدّل UUID والاسم):
--
-- update public.profiles
--   set role = 'super_admin', full_name = 'اسمك الكامل'
--   where id = 'ضع-UUID-هنا';
--
-- بعدها تدخل بحسابك كسوبر أدمن وتنشئ بقية الفريق من داخل التطبيق.
-- =====================================================================
