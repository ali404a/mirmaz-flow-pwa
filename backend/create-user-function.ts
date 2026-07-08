// =====================================================================
// mirmaz FLOW — Edge Function لإنشاء حسابات الفريق (نسخة محصّنة أمنياً)
// المسار: supabase/functions/create-user/index.ts
// النشر:  supabase functions deploy create-user
//
// التحصينات الأمنية:
//   ✓ CORS مقيّد بنطاقك فقط (بدّل ALLOWED_ORIGIN)
//   ✓ التحقق من هوية الطالب وأنه سوبر أدمن/مانيجر
//   ✓ قائمة بيضاء للأدوار (لا يُنشأ سوبر أدمن عبر الدالة)
//   ✓ التحقق من صيغة الإيميل وقوة كلمة المرور
//   ✓ منع المانيجر من إنشاء مانيجر آخر
//   ✓ عدم كشف تفاصيل الأخطاء الداخلية
// =====================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 🔒 بدّل بنطاق موقعك بعد الرفع (مثل https://mirmaz-flow.vercel.app) عبر متغيّر البيئة
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';

// الأدوار المسموح إنشاؤها عبر التطبيق (السوبر أدمن يُنشأ يدوياً فقط)
const ALLOWED_ROLES = [
  'manager', 'coordinator', 'admin', 'reviewer',
  'caption_writer', 'designer', 'text_designer', 'editor'
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });
  if (req.method !== 'POST') return json({ error: 'الطريقة غير مدعومة' }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ error: 'طلب غير صالح' }, 400);
    const { email, password, full_name, role } = body;

    // 1) التحقق من المدخلات
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return json({ error: 'صيغة البريد غير صحيحة' }, 400);
    if (!password || String(password).length < 8)
      return json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, 400);
    if (!full_name || String(full_name).trim().length < 2)
      return json({ error: 'الاسم مطلوب' }, 400);
    if (!ALLOWED_ROLES.includes(role))
      return json({ error: 'دور غير مسموح' }, 400);

    // 2) تحقّق من هوية الطالب عبر التوكن
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'غير مسجّل دخول' }, 401);

    const caller = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: 'جلسة غير صالحة' }, 401);

    // 3) تأكّد أن الطالب سوبر أدمن أو مانيجر
    const { data: prof } = await caller
      .from('profiles').select('role').eq('id', user.id).single();
    if (!prof || !['super_admin', 'manager'].includes(prof.role))
      return json({ error: 'ليس لديك صلاحية إنشاء حسابات' }, 403);

    // 4) المانيجر لا يُنشئ مانيجر آخر (فقط السوبر أدمن)
    if (prof.role === 'manager' && role === 'manager')
      return json({ error: 'المانيجر لا يستطيع إنشاء مانيجر آخر' }, 403);

    // 5) أنشئ المستخدم بمفتاح الخدمة (يبقى سرّياً على الخادم)
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: String(full_name).trim(), role }
    });
    if (error) return json({ error: error.message }, 400);

    return json({ ok: true, user_id: data.user?.id });
  } catch (e) {
    console.error(e);  // لا تكشف التفاصيل للعميل
    return json({ error: 'حدث خطأ في الخادم' }, 500);
  }
});

function cors() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...cors(), 'Content-Type': 'application/json' }
  });
}
