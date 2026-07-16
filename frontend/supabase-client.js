// =====================================================================
// mirmaz FLOW — طبقة الاتصال بـ Supabase (auth + صلاحيات + بيانات)
// الإصدار 2.0
//
// الإعداد:
//   1) بدّل القيمتين أدناه من: Supabase Dashboard > Project Settings > API
//   2) أضف في <head> بالـ index.html قبل هذا الملف:
//      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//
// ملاحظة: مفتاح anon عام بطبيعته وآمن للنشر — الحماية الحقيقية في RLS.
// لا تضع مفتاح service_role هنا إطلاقاً.
// =====================================================================

const SUPABASE_URL  = 'https://xouvnqljqkywhrjqviet.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdXZucWxqcWt5d2hyanF2aWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMDEwOTYsImV4cCI6MjA5OTc3NzA5Nn0.ng2-RJuPgSeVdqM-iF0eo1DSVGJptlp3nI1-vNxpWGw';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

// =====================================================================
// الأدوار — الإنجليزية هي المصدر الوحيد للحقيقة (تطابق enum في القاعدة)
// العربية للعرض فقط.
// =====================================================================
const ROLE_AR = {
  super_admin: 'سوبر أدمن', manager: 'مانيجر', coordinator: 'كوردنيتر',
  admin: 'الإدارة', reviewer: 'مدقق', caption_writer: 'كاتب كابشن',
  designer: 'مصمم', text_designer: 'تكست دزاينر', editor: 'مونتير',
};
const ROLE_ORDER = ['super_admin','manager','coordinator','admin','reviewer',
                    'caption_writer','designer','text_designer','editor'];

// مصفوفة الصلاحيات — يجب أن تطابق سياسات RLS تماماً.
// هذه للواجهة فقط (إخفاء الأزرار). القاعدة هي الحكم النهائي.
const PERMISSIONS = {
  super_admin:    { manageUsers:true,  manageSections:true,  createTask:true,  editAnyStage:true,  approve:true,  review:true,  publish:true,  seeAll:true },
  manager:        { manageUsers:true,  manageSections:true,  createTask:true,  editAnyStage:true,  approve:false, review:true,  publish:true,  seeAll:true },
  coordinator:    { manageUsers:false, manageSections:false, createTask:true,  editAnyStage:true,  approve:false, review:true,  publish:true,  seeAll:true },
  admin:          { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:true,  review:false, publish:false, seeAll:true },
  reviewer:       { manageUsers:false, manageSections:false, createTask:false, editAnyStage:true,  approve:false, review:true,  publish:false, seeAll:true },
  caption_writer: { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:false, seeAll:false },
  designer:       { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:false, seeAll:false },
  text_designer:  { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:false, seeAll:false },
  editor:         { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:true,  seeAll:false },
};

let CURRENT = { user: null, profile: null };

const can    = (perm) => !!(CURRENT.profile && PERMISSIONS[CURRENT.profile.role]?.[perm]);
const myId   = () => CURRENT.user?.id ?? null;
const myRole = () => CURRENT.profile?.role ?? null;
const roleAr = (r) => ROLE_AR[r] ?? r;

// =====================================================================
// المصادقة
// =====================================================================
async function login(email, password) {
  const { error } = await sb.auth.signInWithPassword({
    email: String(email).trim().toLowerCase(),
    password,
  });
  if (error) throw new Error('بيانات الدخول غير صحيحة');
  const cur = await loadCurrentProfile();
  if (!cur.profile)          { await sb.auth.signOut(); throw new Error('لا يوجد ملف شخصي لهذا الحساب'); }
  if (!cur.profile.is_active){ await sb.auth.signOut(); throw new Error('هذا الحساب معطّل — راجع الإدارة'); }
  return cur;
}

async function logout() {
  await sb.auth.signOut();
  CURRENT = { user: null, profile: null };
  location.reload();
}

async function loadCurrentProfile() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) { CURRENT = { user: null, profile: null }; return CURRENT; }
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  CURRENT = { user, profile: profile ?? null };
  return CURRENT;
}

async function initSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return false;
  await loadCurrentProfile();
  return !!(CURRENT.profile && CURRENT.profile.is_active);
}

// يبقي الواجهة متزامنة مع حالة الجلسة (انتهاء صلاحية / خروج من تبويب آخر)
sb.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') { CURRENT = { user: null, profile: null }; location.reload(); }
});

// =====================================================================
// إدارة الفريق (سوبر أدمن / مانيجر)
// =====================================================================
async function createTeamMember(email, password, full_name, role, avatar_color = '#2563EB') {
  if (!can('manageUsers')) throw new Error('ليس لديك صلاحية إنشاء حسابات');
  const { data, error } = await sb.functions.invoke('create-user', {
    body: { email, password, full_name, role, avatar_color },
  });
  if (error) throw new Error(data?.error || 'تعذّر إنشاء الحساب');
  if (data?.error) throw new Error(data.error);
  return data;
}

async function updateMember(id, fields) {
  const allowed = ['full_name', 'avatar_color', 'phone', 'telegram', 'role', 'is_active'];
  const patch = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  const { error } = await sb.from('profiles').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

async function deactivateMember(id) {
  if (!can('manageUsers')) throw new Error('ليس لديك صلاحية');
  const { error } = await sb.from('profiles').update({ is_active: false }).eq('id', id);
  if (error) throw new Error(error.message);
}

// =====================================================================
// جلب البيانات (RLS يُطبَّق تلقائياً)
// =====================================================================
// ملاحظة أداء: بلا حد، هذا الاستعلام ينزّل ~8 ميغابايت عند 2000 مهمة
// (قِيس فعلياً) = ~13 ثانية على 4G. الحد الافتراضي 60 مهمة نشطة.
async function fetchTasks({ limit = 60, offset = 0, includeDone = false } = {}) {
  let q = sb.from('tasks')
    .select('*, stages(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  (data || []).forEach(t => t.stages?.sort((a, b) => a.sort_order - b.sort_order));
  if (includeDone) return data || [];
  // المهام المكتملة بالكامل تُخفى افتراضياً (تظهر في الأرشيف/التقويم)
  return (data || []).filter(t =>
    !(t.stages?.length && t.stages.every(x => ['done','approved','published'].includes(x.state))));
}

// عدّ إجمالي بلا تنزيل البيانات — للترقيم
async function countTasks() {
  const { count } = await sb.from('tasks').select('id', { count: 'exact', head: true });
  return count || 0;
}

async function fetchTeam() {
  const { data } = await sb.from('profiles').select('*').eq('is_active', true).order('full_name');
  return data || [];
}
async function fetchSections() {
  const { data } = await sb.from('sections').select('*').order('sort_order');
  return data || [];
}
async function fetchNotifications() {
  const { data } = await sb.from('notifications')
    .select('*').order('created_at', { ascending: false }).limit(50);
  return data || [];
}

// =====================================================================
// المهام والمراحل
// =====================================================================
async function createTask(task, stages) {
  if (!can('createTask')) throw new Error('ليس لديك صلاحية إنشاء مهام');
  const { data: t, error } = await sb.from('tasks').insert({
    title: task.title, description: task.desc ?? '', brand: task.brand,
    priority: task.priority, due_date: task.due || null,
    is_partnership: !!task.isPartnership,
    coordinator: myId(), created_by: myId(),
    coord_note: task.coordNote ?? '', coord_link: task.coordLink ?? '',
  }).select().single();
  if (error) throw new Error(error.message);

  const rows = stages.map((s, i) => ({
    task_id: t.id, kind: s.kind, assignee: s.person || null,
    state: 'pending', sort_order: i,
  }));
  const { error: sErr } = await sb.from('stages').insert(rows);
  if (sErr) { await sb.from('tasks').delete().eq('id', t.id); throw new Error(sErr.message); }
  return t;
}

// ملاحظة: last_edit_by / last_edit_at لا تُرسل من هنا —
// الـ trigger في القاعدة يضبطها. إرسالها من العميل كان يسمح بالتزوير.
async function saveStageEdit(stageId, fields) {
  const allowed = ['text_content', 'note', 'link', 'publish_date', 'publish_time', 'state', 'assignee'];
  const patch = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  const { error } = await sb.from('stages').update(patch).eq('id', stageId);
  if (error) throw new Error(error.message);
}

async function approveStage(stageId) {
  if (!can('approve')) throw new Error('الموافقة من صلاحية الإدارة فقط');
  const { error } = await sb.from('stages').update({ state: 'approved', reason: '' }).eq('id', stageId);
  if (error) throw new Error(error.message);
}
async function rejectStage(stageId, reason) {
  if (!can('approve')) throw new Error('الرفض من صلاحية الإدارة فقط');
  const { error } = await sb.from('stages').update({ state: 'rejected', reason }).eq('id', stageId);
  if (error) throw new Error(error.message);
}
async function deleteTask(taskId) {
  const { error } = await sb.from('tasks').delete().eq('id', taskId);
  if (error) throw new Error(error.message);
}

// =====================================================================
// المهام الشخصية (معزولة بـ RLS)
// =====================================================================
async function fetchPersonal() {
  const { data } = await sb.from('personal_tasks').select('*')
    .order('created_at', { ascending: false });
  return data || [];
}
async function addPersonal(title, details) {
  const { error } = await sb.from('personal_tasks').insert({ owner: myId(), title, details });
  if (error) throw new Error(error.message);
}
async function togglePersonal(id, is_done) {
  await sb.from('personal_tasks').update({ is_done }).eq('id', id);
}
async function deletePersonal(id) {
  await sb.from('personal_tasks').delete().eq('id', id);
}

// =====================================================================
// الإشعارات
// =====================================================================
async function notify(userId, type, title, body, taskId = null) {
  await sb.from('notifications').insert({
    user_id: userId, actor: myId(), type, title, body, task_id: taskId,
  });
}
async function markNotifRead(id) {
  await sb.from('notifications').update({ is_read: true }).eq('id', id);
}

// =====================================================================
// المحادثة
// =====================================================================
async function fetchChannels() {
  const { data } = await sb.from('chat_channels').select('*').order('created_at');
  return data || [];
}
async function fetchMessages(channelId) {
  const { data } = await sb.from('chat_messages')
    .select('*, profiles(full_name, avatar_color)')
    .eq('channel_id', channelId).order('created_at').limit(200);
  return data || [];
}
async function sendMessage(channelId, body) {
  const { error } = await sb.from('chat_messages')
    .insert({ channel_id: channelId, sender: myId(), body });
  if (error) throw new Error(error.message);
}
function subscribeMessages(channelId, onNew) {
  return sb.channel('chat:' + channelId)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${channelId}` },
      (payload) => onNew(payload.new))
    .subscribe();
}

// الاشتراك اللحظي بالمهام — يبقي لوحة العرض حيّة بلا polling
function subscribeBoard(onChange) {
  return sb.channel('board')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks'  }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stages' }, onChange)
    .subscribe();
}
