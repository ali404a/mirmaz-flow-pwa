// =====================================================================
// mirmaz FLOW — Edge Function لإنشاء حسابات الفريق
// الإصدار 2.0
//
// المسار: supabase/functions/create-user/index.ts
// النشر:  supabase functions deploy create-user
//
// متغيّرات البيئة المطلوبة (Dashboard > Edge Functions > Secrets):
//   ALLOWED_ORIGIN = https://your-domain.vercel.app   (إلزامي في الإنتاج)
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (تلقائية)
//
// التحصينات:
//   - CORS مقيّد بنطاقك (لا '*' في الإنتاج)
//   - التحقق من هوية الطالب وأنه سوبر أدمن/مانيجر ونشِط
//   - قائمة بيضاء للأدوار (لا يُنشأ super_admin عبر الدالة إطلاقاً)
//   - المانيجر لا يُنشئ مانيجر آخر
//   - الدور يُكتب في profiles بمفتاح الخدمة (لا يُقرأ من metadata العميل)
//   - تنظيف الحساب إن فشلت كتابة الملف الشخصي (لا حسابات يتيمة)
//   - عدم كشف الأخطاء الداخلية
// =====================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '';

const ALLOWED_ROLES = [
  'manager', 'coordinator', 'admin', 'reviewer',
  'caption_writer', 'designer', 'text_designer', 'editor',
] as const;

const HEX = /^#[0-9A-Fa-f]{6}$/;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });
  if (req.method !== 'POST') return json({ error: 'الطريقة غير مدعومة' }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ error: 'طلب غير صالح' }, 400);

    const email     = String(body.email ?? '').trim().toLowerCase();
    const password  = String(body.password ?? '');
    const full_name = String(body.full_name ?? '').trim();
    const role      = String(body.role ?? '');
    const color     = String(body.avatar_color ?? '#2563EB');

    // ---------- 1) التحقق من المدخلات ----------
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email))
      return json({ error: 'صيغة البريد غير صحيحة' }, 400);
    if (password.length < 12)
      return json({ error: 'كلمة المرور يجب أن تكون 12 محرفاً على الأقل' }, 400);
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password))
      return json({ error: 'كلمة المرور تحتاج حرفاً كبيراً وصغيراً ورقماً' }, 400);
    if (full_name.length < 2 || full_name.length > 80)
      return json({ error: 'الاسم مطلوب (2–80 حرفاً)' }, 400);
    if (!ALLOWED_ROLES.includes(role as typeof ALLOWED_ROLES[number]))
      return json({ error: 'دور غير مسموح' }, 400);
    if (!HEX.test(color))
      return json({ error: 'لون غير صالح' }, 400);

    // ---------- 2) التحقق من هوية الطالب ----------
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'غير مسجّل دخول' }, 401);

    const caller = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: uErr } = await caller.auth.getUser();
    if (uErr || !user) return json({ error: 'جلسة غير صالحة' }, 401);

    // ---------- 3) صلاحية الطالب ----------
    const { data: prof } = await caller
      .from('profiles').select('role, is_active').eq('id', user.id).single();

    if (!prof || !prof.is_active || !['super_admin', 'manager'].includes(prof.role))
      return json({ error: 'ليس لديك صلاحية إنشاء حسابات' }, 403);

    // المانيجر لا يُنشئ مانيجر آخر (تصعيد أفقي)
    if (prof.role === 'manager' && role === 'manager')
      return json({ error: 'المانيجر لا يستطيع إنشاء مانيجر آخر' }, 403);

    // ---------- 4) الإنشاء بمفتاح الخدمة ----------
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });
    if (cErr) {
      const dup = /already|exists|registered/i.test(cErr.message);
      return json({ error: dup ? 'هذا البريد مستخدم مسبقاً' : 'تعذّر إنشاء الحساب' }, 400);
    }

    const newId = created.user?.id;
    if (!newId) return json({ error: 'تعذّر إنشاء الحساب' }, 500);

    // الدور يُضبط هنا بمفتاح الخدمة — trigger handle_new_user يضع أدنى دور،
    // ونحن نرقّيه للدور المطلوب بعد التحقق من صلاحية الطالب.
    const { error: pErr } = await admin.from('profiles').upsert({
      id: newId, full_name, role, avatar_color: color, is_active: true,
    }, { onConflict: 'id' });

    if (pErr) {
      // تنظيف: لا نترك حساب auth بلا ملف شخصي
      await admin.auth.admin.deleteUser(newId).catch(() => {});
      console.error('profile upsert failed:', pErr);
      return json({ error: 'تعذّر إكمال إنشاء الحساب' }, 500);
    }

    return json({ ok: true, user_id: newId });
  } catch (e) {
    console.error(e);
    return json({ error: 'حدث خطأ في الخادم' }, 500);
  }
});

function cors() {
  const h: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
  // في الإنتاج: لا تسمح بأي نطاق إن لم يُضبط ALLOWED_ORIGIN
  if (ALLOWED_ORIGIN) h['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
  return h;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}
