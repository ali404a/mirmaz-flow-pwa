// =====================================================================
// mirmaz FLOW — طبقة الاتصال بـ Supabase (auth + صلاحيات + بيانات)
// ضع هذا الملف باسم supabase-client.js بجانب index.html
// واستبدل القيمتين أدناه بقيم مشروعك من Supabase.
// =====================================================================

// 1) من Supabase Dashboard > Project Settings > API
const SUPABASE_URL  = 'https://YOUR-PROJECT.supabase.co';   // ← بدّلها
const SUPABASE_ANON = 'YOUR-ANON-PUBLIC-KEY';               // ← بدّلها

// تحميل مكتبة Supabase من CDN (أضف هذا السطر في <head> بالـ index.html):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// =====================================================================
// مصفوفة الصلاحيات — مرجع واحد لكل التخصصات
// =====================================================================
const PERMISSIONS = {
  super_admin:    { manageUsers:true,  manageSections:true,  createTask:true,  editAnyStage:true,  approve:true,  review:true,  publish:true,  seeAll:true },
  manager:        { manageUsers:true,  manageSections:true,  createTask:true,  editAnyStage:true,  approve:false, review:true,  publish:true,  seeAll:true },
  coordinator:    { manageUsers:false, manageSections:false, createTask:true,  editAnyStage:true,  approve:false, review:true,  publish:true,  seeAll:true },
  admin:          { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:true,  review:false, publish:false, seeAll:true },
  reviewer:       { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:true,  publish:false, seeAll:true },
  caption_writer: { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:false, seeAll:false },
  designer:       { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:false, seeAll:false },
  text_designer:  { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:false, seeAll:false },
  editor:         { manageUsers:false, manageSections:false, createTask:false, editAnyStage:false, approve:false, review:false, publish:true,  seeAll:false },
};
// أسماء التخصصات بالعربي
const ROLE_AR = {
  super_admin:'سوبر أدمن', manager:'مانيجر', coordinator:'كوردنيتر', admin:'الإدارة',
  reviewer:'مدقق', caption_writer:'كاتب كابشن', designer:'مصمم', text_designer:'تكست دزاينر', editor:'مونتير'
};

let CURRENT = { user:null, profile:null }; // المستخدم الحالي وملفه

function can(perm){ return CURRENT.profile && PERMISSIONS[CURRENT.profile.role]?.[perm]; }
function myId(){ return CURRENT.user?.id; }
function myRole(){ return CURRENT.profile?.role; }

// =====================================================================
// تسجيل الدخول والخروج
// =====================================================================
async function login(email, password){
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if(error) throw error;
  await loadCurrentProfile();
  return CURRENT;
}
async function logout(){
  await sb.auth.signOut();
  CURRENT = { user:null, profile:null };
  location.reload();
}
async function loadCurrentProfile(){
  const { data:{ user } } = await sb.auth.getUser();
  if(!user){ CURRENT={user:null,profile:null}; return null; }
  const { data:profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  CURRENT = { user, profile };
  return CURRENT;
}
// استرجاع الجلسة عند فتح الصفحة
async function initSession(){
  const { data:{ session } } = await sb.auth.getSession();
  if(session){ await loadCurrentProfile(); return true; }
  return false;
}

// =====================================================================
// السوبر أدمن / المانيجر: إنشاء حسابات الفريق
// ملاحظة: إنشاء مستخدم بكلمة مرور يتم عبر Edge Function آمنة (انظر الدليل)،
// أو من لوحة Supabase. هنا دالة الاستدعاء للـ Edge Function:
// =====================================================================
async function createTeamMember(email, password, full_name, role){
  if(!can('manageUsers')) throw new Error('ليس لديك صلاحية إنشاء حسابات');
  const { data, error } = await sb.functions.invoke('create-user', {
    body: { email, password, full_name, role }
  });
  if(error) throw error;
  return data;
}

// =====================================================================
// جلب البيانات (تحترم RLS تلقائياً)
// =====================================================================
async function fetchTasks(){
  const { data, error } = await sb
    .from('tasks')
    .select('*, stages(*)')
    .order('created_at', { ascending:false });
  if(error) throw error;
  return data;
}
async function fetchTeam(){
  const { data } = await sb.from('profiles').select('*').eq('is_active', true);
  return data || [];
}
async function fetchSections(){
  const { data } = await sb.from('sections').select('*').order('sort_order');
  return data || [];
}
async function fetchNotifications(){
  const { data } = await sb.from('notifications')
    .select('*').order('created_at',{ascending:false}).limit(50);
  return data || [];
}

// إنشاء مهمة + مراحلها
async function createTask(task, stages){
  if(!can('createTask')) throw new Error('ليس لديك صلاحية إنشاء مهام');
  const { data:t, error } = await sb.from('tasks').insert({
    title:task.title, description:task.desc, brand:task.brand,
    priority:task.priority, due_date:task.due, coordinator:myId(),
    coord_note:task.coordNote, coord_link:task.coordLink
  }).select().single();
  if(error) throw error;
  const rows = stages.map((s,i)=>({
    task_id:t.id, kind:s.kind, assignee:s.person||null,
    state:'pending', sort_order:i
  }));
  await sb.from('stages').insert(rows);
  return t;
}

// تعديل مرحلة (يسجّل من عدّل ومتى + يعيد للتدقيق)
async function saveStageEdit(stageId, fields){
  const patch = { ...fields, last_edit_by:myId(), last_edit_at:new Date().toISOString(), state:'working' };
  const { error } = await sb.from('stages').update(patch).eq('id', stageId);
  if(error) throw error;
  // إعادة المراحل التالية للانتظار تتم عبر دالة قاعدة بيانات أو منطق التطبيق
}

// الموافقة/الرفض (للإدارة فقط)
async function approveStage(stageId){
  if(!can('approve')) throw new Error('الموافقة من صلاحية الإدارة فقط');
  await sb.from('stages').update({ state:'approved' }).eq('id', stageId);
}
async function rejectStage(stageId, reason){
  if(!can('approve')) throw new Error('الرفض من صلاحية الإدارة فقط');
  await sb.from('stages').update({ state:'rejected', reason }).eq('id', stageId);
}

// المهام الشخصية (معزولة)
async function fetchPersonal(){
  const { data } = await sb.from('personal_tasks').select('*')
    .eq('owner', myId()).order('created_at',{ascending:false});
  return data || [];
}
async function addPersonal(title, details){
  await sb.from('personal_tasks').insert({ owner:myId(), title, details });
}

// المحادثة (لاحقاً تُربط بتيمز عبر Graph API — انظر الدليل)
async function fetchMessages(channelId){
  const { data } = await sb.from('chat_messages')
    .select('*, profiles(full_name, avatar_color)')
    .eq('channel_id', channelId).order('created_at');
  return data || [];
}
async function sendMessage(channelId, body){
  await sb.from('chat_messages').insert({ channel_id:channelId, sender:myId(), body });
}

// الاشتراك اللحظي بالرسائل (Realtime) — يخلي الشات حيّ
function subscribeMessages(channelId, onNew){
  return sb.channel('chat:'+channelId)
    .on('postgres_changes',
      { event:'INSERT', schema:'public', table:'chat_messages', filter:`channel_id=eq.${channelId}` },
      payload => onNew(payload.new))
    .subscribe();
}
