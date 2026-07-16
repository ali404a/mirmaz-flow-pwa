const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Hide Team from Nav for normal users
html = html.replace(
  "if(u && u.role === 'شريك خارجي') { navItems = NAV.filter(n => ['partnerships', 'settings', 'notifications'].includes(n.id)); }",
  "if(u && u.role === 'شريك خارجي') { navItems = NAV.filter(n => ['partnerships', 'settings', 'notifications'].includes(n.id)); }\n  else if (u && !['الإدارة','مانيجر','كوردنيتر'].includes(u.role)) { navItems = NAV.filter(n => n.id !== 'team'); }"
);

// 2. Add Personal Task Functions
const personalFuncs = `
function addPersonalTask() {
  const t = prompt('عنوان المهمة الخاصة:');
  if(!t) return;
  const d = prompt('التفاصيل (اختياري):');
  const uid = store.currentUser;
  if(!store.personal[uid]) store.personal[uid]=[];
  store.personal[uid].push({id:'p'+Date.now(), title:t, desc:d||'', done:false});
  save();
  render();
}
function editPersonalTask(pid) {
  const uid = store.currentUser;
  const pt = store.personal[uid].find(x=>x.id===pid);
  if(!pt) return;
  const t = prompt('عنوان المهمة:', pt.title);
  if(!t) return;
  const d = prompt('التفاصيل:', pt.desc);
  pt.title = t;
  pt.desc = d||'';
  save();
  render();
}
function deletePersonalTask(pid) {
  if(!confirm('حذف المهمة؟')) return;
  const uid = store.currentUser;
  store.personal[uid] = store.personal[uid].filter(x=>x.id!==pid);
  save();
  render();
}
function togglePersonalTask(pid) {
  const uid = store.currentUser;
  const pt = store.personal[uid].find(x=>x.id===pid);
  if(pt) { pt.done = !pt.done; save(); render(); }
}
function viewPersonal(){
  const uid = store.currentUser;
  let ptasks = store.personal[uid] || [];
  return \`<div class="maps-bar fade-up"><div class="maps-count"><strong>\${ptasks.length}</strong> مهام خاصة</div>
  <button class="pill-blue" onclick="addPersonalTask()">+ إضافة مهمة خاصة</button></div>
  <div class="maps-grid">
    \${ptasks.map(pt=>\`<div class="card fade-up" style="padding:16px;border-right:4px solid \${pt.done?'var(--green-ok)':'var(--blue)'}; position:relative;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <h3 style="margin:0 0 8px 0;text-decoration:\${pt.done?'line-through':'none'};color:\${pt.done?'var(--ink-400)':'var(--ink-700)'}">\${esc(pt.title)}</h3>
          <p style="margin:0;color:var(--ink-500);font-size:14px;white-space:pre-wrap;">\${esc(pt.desc)}</p>
        </div>
        <input type="checkbox" \${pt.done?'checked':''} onchange="togglePersonalTask('\${pt.id}')" style="width:20px;height:20px;cursor:pointer;">
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;">
        <button class="btn-sm btn-gray" onclick="editPersonalTask('\${pt.id}')">\${icon('edit', 14)} تعديل</button>
        <button class="btn-sm btn-gray" style="color:var(--red)" onclick="deletePersonalTask('\${pt.id}')">\${icon('trash', 14)} حذف</button>
      </div>
    </div>\`).join('')}
  </div>\`;
}
`;

// Insert after viewSettings
html = html.replace(/function viewSettings\(\)\{([\s\S]*?^\})/m, "$&\n" + personalFuncs);

// 3. Fix viewTeam and viewProfile
const viewTeamFunc = `
let currentProfileId = null;

function viewTeam(){
  if(currentProfileId) return viewProfile(currentProfileId);
  const u = userById(store.currentUser);
  const canEdit = ['الإدارة','مانيجر','كوردنيتر'].includes(u.role);
  if(!canEdit) return '<div class="empty card">غير مصرح لك بعرض هذه الصفحة</div>';

  return \`<div class="maps-bar fade-up"><div class="maps-count"><strong>\${store.team.length}</strong> أعضاء</div>
  <button class="pill-blue" onclick="openProfileModal()">+ إضافة موظف</button></div>
  <div class="maps-grid">
    \${store.team.map(member=>{
      let tCount=0, dCount=0;
      store.tasks.forEach(t=>t.stages.forEach(s=>{if(s.person===member.id){tCount++;if(['done','approved'].includes(s.state))dCount++;}}));
      const rate = tCount ? Math.round(dCount/tCount*100) : 0;
      return \`<div class="card fade-up" style="padding:20px;display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="width:70px;height:70px;border-radius:50%;background:\${member.av}18;color:\${member.av};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;">\${member.name[0]}</div>
        <div style="text-align:center;">
          <h3 style="margin:0;color:var(--ink-700)">\${esc(member.name)}</h3>
          <p style="margin:4px 0 0 0;color:var(--ink-500);font-size:14px">\${esc(member.role)}</p>
        </div>
        <div style="width:100%;height:1px;background:var(--line);margin:8px 0"></div>
        <div style="display:flex;width:100%;justify-content:space-between;font-size:13px;color:var(--ink-600);margin-bottom:12px;">
          <span>المهام: <strong>\${tCount}</strong></span>
          <span>الإنجاز: <strong style="color:var(--green-ok)">\${rate}%</strong></span>
        </div>
        <button class="btn-sm btn-gray" style="width:100%;justify-content:center" onclick="currentProfileId='\${member.id}';render()">عرض التفاصيل والملف</button>
      </div>\`;
    }).join('')}
  </div>\`;
}

function viewProfile(uid) {
  const member = store.team.find(x=>x.id===uid);
  if(!member) return '<div class="empty card">المستخدم غير موجود</div>';
  
  let mine=[];
  store.tasks.forEach(t=>t.stages.forEach(st=>{if(st.person===uid)mine.push({task:t,st});}));

  return \`<div class="maps-bar fade-up">
    <button class="btn-sm btn-gray" onclick="currentProfileId=null;render()">\${icon('arrow-right', 16)} رجوع للفريق</button>
    <button class="btn-sm btn-blue" onclick="openProfileModal('\${uid}')">\${icon('edit', 14)} تعديل بيانات الموظف</button>
  </div>
  <div style="display:grid;grid-template-columns:1fr 2fr;gap:24px;margin-top:20px;" class="fade-up">
    <div class="card" style="padding:24px;text-align:center;">
      <div style="width:100px;height:100px;border-radius:50%;background:\${member.av}18;color:\${member.av};display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:bold;margin:0 auto 16px auto;">\${member.name[0]}</div>
      <h2 style="margin:0 0 8px 0;">\${esc(member.name)}</h2>
      <p style="margin:0 0 20px 0;color:var(--ink-500)">\${esc(member.role)}</p>
      
      <div style="display:flex;flex-direction:column;gap:12px;text-align:right;background:var(--surface-2);padding:16px;border-radius:8px;">
        <div><small style="color:var(--ink-400)">رقم الهاتف:</small><br><strong>\${esc(member.phone||'غير محدد')}</strong></div>
        <div><small style="color:var(--ink-400)">معرف التليجرام:</small><br><strong>\${esc(member.telegram||'غير محدد')}</strong></div>
        <div><small style="color:var(--ink-400)">اسم المستخدم (للدخول):</small><br><strong>\${esc(member.user||member.id)}</strong></div>
        <div><small style="color:var(--ink-400)">الرمز السري:</small><br><strong>\${esc(member.pass||'1234')}</strong></div>
      </div>
    </div>
    
    <div class="card" style="padding:24px;">
      <h3 style="margin:0 0 16px 0;">المهام الموكلة (\${mine.length})</h3>
      \${mine.length ? \`<div style="display:flex;flex-direction:column;gap:12px;">
        \${mine.map(m=>\`<div style="border:1px solid var(--line);border-radius:8px;padding:12px;display:flex;justify-content:space-between;align-items:center;border-right:4px solid \${m.st.state==='done'?'var(--green-ok)':'var(--blue)'}">
          <div>
            <div style="font-weight:bold;margin-bottom:4px;">\${esc(m.task.title)}</div>
            <div style="font-size:13px;color:var(--ink-500)">\${(STAGE_KINDS[m.st.kind]||{ar:'غير معروف'}).ar}</div>
          </div>
          <span class="chip" style="background:var(--surface-2)">\${m.st.state==='done'?'✅ منجز':'⏳ قيد العمل'}</span>
        </div>\`).join('')}
      </div>\` : '<div class="empty" style="margin:0">لا توجد مهام حالية</div>'}
    </div>
  </div>\`;
}
`;

html = html.replace(/function viewTeam\(\)\{[\s\S]*?^\}/m, viewTeamFunc);

// 4. Update openProfileModal and saveTeamMember
html = html.replace(/function openProfileModal[\s\S]*?function saveTeamMember[\s\S]*?^\}/m, 
`let profileEditId = null;
function openProfileModal(uid = null){
  const canEdit = ['الإدارة','مانيجر','كوردنيتر'].includes(userById(store.currentUser).role);
  if(!canEdit) return;
  profileEditId = uid;
  let u = uid ? store.team.find(x=>x.id===uid) : {id:'u'+Date.now(), name:'', role:'مصمم', av:'#3B6FF0', user:'', pass:'', phone:'', telegram:''};
  
  const roles=['الإدارة','مانيجر','كوردنيتر','مصمم','كاتب محتوى','كاتب كابشن','مونتير','شريك خارجي'];

  const m=document.createElement('div');
  m.className='modal';
  m.innerHTML=\`<div class="modal-box card" style="max-width:400px">
    <h3 style="margin-top:0">\${uid?'تعديل بيانات الموظف':'إضافة موظف جديد'}</h3>
    <div style="display:flex;flex-direction:column;gap:12px;max-height:60vh;overflow-y:auto;padding-right:8px;">
      <div class="np-field"><label>الاسم</label><input id="tmName" value="\${esc(u.name)}" placeholder="اسم الموظف"></div>
      <div class="np-field"><label>الدور الوظيفي</label>
        <select id="tmRole">\${roles.map(r=>\`<option \${u.role===r?'selected':''}>\${r}</option>\`).join('')}</select>
      </div>
      <div class="np-field"><label>رقم الهاتف</label><input id="tmPhone" value="\${esc(u.phone||'')}" placeholder="07..."></div>
      <div class="np-field"><label>معرف التليجرام</label><input id="tmTelegram" value="\${esc(u.telegram||'')}" placeholder="@username"></div>
      
      <div style="border-top:1px dashed var(--line);margin:10px 0;"></div>
      
      <div class="np-field"><label>اسم المستخدم (لتسجيل الدخول)</label><input id="tmUser" value="\${esc(u.user||u.id||'')}" placeholder="Username"></div>
      <div class="np-field"><label>الرمز السري</label><input id="tmPass" value="\${esc(u.pass||'1234')}" placeholder="Password"></div>
      
      <div class="np-field"><label>اللون التعريفي</label><input type="color" id="tmAv" value="\${u.av}"></div>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button class="pill-blue" style="flex:1;justify-content:center" onclick="saveTeamMember()">حفظ التعديلات</button>
      <button class="btn-gray" style="flex:1;justify-content:center;border-radius:100px" onclick="closeModal()">إلغاء</button>
    </div>
  </div>\`;
  document.body.appendChild(m);
}
function saveTeamMember(){
  const name=document.getElementById('tmName').value.trim();
  const role=document.getElementById('tmRole').value;
  const av=document.getElementById('tmAv').value;
  const phone=document.getElementById('tmPhone').value.trim();
  const telegram=document.getElementById('tmTelegram').value.trim();
  const user=document.getElementById('tmUser').value.trim();
  const pass=document.getElementById('tmPass').value.trim();
  
  if(!name)return alert('اكتب الاسم');
  let u;
  if(profileEditId){
    u=store.team.find(x=>x.id===profileEditId);
    if(u){
       u.name=name; u.role=role; u.av=av;
       u.phone=phone; u.telegram=telegram; u.user=user; u.pass=pass;
    }
  } else {
    u={id:'u'+Date.now(), name, role, av, phone, telegram, user, pass};
    store.team.push(u);
  }
  save();
  closeModal();
  render();
}
`);

fs.writeFileSync('index.html', html);
console.log('Done!');
