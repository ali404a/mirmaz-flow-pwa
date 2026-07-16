const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Sidebar Layout & Logout
// Add padding to .sidebar
html = html.replace(/\.sidebar\s*\{/, '.sidebar { padding-bottom: 80px; ');
// Ensure sidebar scroll
html = html.replace(/\.sidebar\{[^\}]*\}/g, (match) => {
  if(!match.includes('overflow-y')) return match.replace('{', '{ overflow-y: auto; overflow-x: hidden; ');
  return match;
});

// Append logout button to sidebar
html = html.replace(/(<div id="sbSummary" class="sb-sum"><\/div>)/, '$1\n      <div style="margin-top:auto;padding-top:16px"><button onclick="logout()" style="width:100%;padding:12px;background:var(--red-soft);color:var(--red);border:none;border-radius:8px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">${icon("cross", 16)} تسجيل الخروج</button></div>');

// 2. Authentication System UI
const loginUI = `
<div id="loginScreen" style="position:fixed;inset:0;background:var(--bg);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;">
  <div class="card" style="width:100%;max-width:400px;padding:32px;display:flex;flex-direction:column;gap:20px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.1);">
    <h1 style="color:var(--blue-600);margin:0;font-size:28px;">Mirmaz Flow</h1>
    <p style="color:var(--ink-500);margin:0">تسجيل الدخول للمنظومة</p>
    <div id="loginError" style="color:var(--red);font-size:14px;display:none;">بيانات الدخول غير صحيحة</div>
    <div style="display:flex;flex-direction:column;gap:12px;text-align:right;">
      <label style="font-weight:bold;color:var(--ink-700)">اسم المستخدم</label>
      <input type="text" id="loginUser" class="tmap-in" placeholder="Username" style="padding:12px;font-size:16px;">
      
      <label style="font-weight:bold;color:var(--ink-700)">كلمة المرور</label>
      <div style="position:relative;display:flex;align-items:center;">
        <input type="password" id="loginPass" class="tmap-in" placeholder="Password" style="padding:12px;font-size:16px;width:100%;">
        <button onclick="togglePassword()" style="position:absolute;left:10px;background:none;border:none;color:var(--ink-500);cursor:pointer;padding:5px;">👁</button>
      </div>
    </div>
    <button class="pill-blue" onclick="performLogin()" style="padding:14px;font-size:16px;margin-top:10px;">تسجيل الدخول</button>
  </div>
</div>
<script>
function togglePassword(){
  const p=document.getElementById('loginPass');
  p.type = p.type==='password'?'text':'password';
}
function performLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value.trim();
  const user = store.team.find(x => (x.user||x.id) === u && (x.pass||'1234') === p);
  if(user){
    localStorage.setItem('mirmaz_session', user.id);
    store.currentUser = user.id;
    document.getElementById('loginScreen').style.display='none';
    render();
  } else {
    document.getElementById('loginError').style.display='block';
  }
}
function logout(){
  localStorage.removeItem('mirmaz_session');
  location.reload();
}
</script>
`;
// Insert login screen before <div class="app-layout">
html = html.replace(/<div class="app-layout">/, loginUI + '\n<div class="app-layout">');

// In load(), handle migration and session
html = html.replace(/return\{team:DEFAULT_TEAM/, `return {team:DEFAULT_TEAM.map(u=>({...u, user: u.id, pass: '1234'})),`);
// Add session check at the end of load()
const migrationCode = `
  d.team.forEach(u => { if(!u.user) u.user = u.id; if(!u.pass) u.pass = '1234'; });
  const session = localStorage.getItem('mirmaz_session');
  if(session && d.team.find(x=>x.id===session)) {
    d.currentUser = session;
  } else {
    d.currentUser = null; // Needs login
  }
`;
html = html.replace(/return d;\s*\}\s*catch\(e\)/, `${migrationCode} return d; } catch(e)`);
html = html.replace(/currentUser:'u3'/, `currentUser:null`);

// Hide app layout if not logged in
html = html.replace(/renderRoleSwitch\(\);/, `
  if(!store.currentUser) {
    document.querySelector('.app-layout').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    return;
  } else {
    document.querySelector('.app-layout').style.display = 'flex';
    const ls = document.getElementById('loginScreen');
    if(ls) ls.style.display = 'none';
  }
`);
html = html.replace(/<div class="role-switch" id="roleSwitch"><\/div>/, ''); // Remove old role switch HTML

// 3. Home Page UI (Clickable stats and Redesigned circular charts)
html = html.replace(/const stats=\[([\s\S]*?)\];/, `const stats=[
    {ic:'doc',c:'var(--blue-600)',sc:'var(--blue-50)',v:tasks.length,l:'إجمالي المهام',d:'+18%',up:true, page:'maps'},
    {ic:'check',c:'var(--green-ok)',sc:'var(--green-soft)',v:doneStages,l:'مراحل منجزة',d:'+24%',up:true, page:'mytasks'},
    {ic:'flame',c:'var(--red)',sc:'var(--red-soft)',v:critTasks,l:'مهام قصوى',d:'عاجل',up:false, page:'maps', query:'critical'},
    {ic:'publish',c:'var(--violet)',sc:'var(--violet-soft)',v:pubScheduled,l:'منشورات مجدولة',d:'+12%',up:true, page:'calendar'},
    {ic:'target',c:'var(--amber)',sc:'var(--amber-soft)',v:rate+'%',l:'معدل الإنجاز',d:'+5.6%',up:true, page:'analytics'},
  ];`);

html = html.replace(/<div class="stat-card fade-up"[^>]*>/g, `<div class="stat-card fade-up" style="cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'" `);
// Add onclick to stat cards
html = html.replace(/stats\.map\(\(s,i\)=>\`<div class="stat-card fade-up"/, `stats.map((s,i)=>\`<div class="stat-card fade-up" onclick="if(s.query) { searchQuery = s.query; } go(s.page)"`);


// Update Circular Charts Design
html = html.replace(/<svg width="80" height="80">/g, `<svg width="100" height="100" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
      <defs>
        <linearGradient id="grad-\${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="\${c}" />
          <stop offset="100%" stop-color="\${c}88" />
        </linearGradient>
      </defs>`);
html = html.replace(/cx="40" cy="40" r="34"/g, `cx="50" cy="50" r="42"`);
html = html.replace(/stroke="\$\{c\}"/g, `stroke="url(#grad-\${i})"`);
html = html.replace(/stroke-width="8"/g, `stroke-width="12"`);
html = html.replace(/stroke-dasharray="213"/g, `stroke-dasharray="264"`); // 2 * PI * 42 = 263.89
html = html.replace(/213 - \(213/g, `264 - (264`);
html = html.replace(/<div class="home-perf-val" style="color:\$\{c\}">\$\{val\}%<\/div>/, `<div class="home-perf-val" style="color:\$\{c\};font-size:22px;font-weight:800;">\$\{val\}%</div>`);


// 4. Sheet Edit Redirection
html = html.replace(/openSheetTaskModal/g, 'openTaskModal');
// Then we can remove openSheetTaskModal definition
html = html.replace(/function openSheetTaskModal\([\s\S]*?function closeSheetModal\(\) \{ [^\}]* \}/, '');
html = html.replace(/function saveSheetItem\(\) \{[\s\S]*?render\(\);\s*\}/, '');

// 5. Team Management & Profiles
// Redesign viewTeam
const newViewTeam = `
function viewTeam(){
  const canEdit = ['الإدارة','مانيجر','كوردنيتر'].includes(userById(store.currentUser).role);
  return \`<div class="maps-bar fade-up"><div class="maps-count"><strong>\${store.team.length}</strong> أعضاء</div>
  \${canEdit ? \`<button class="pill-blue" onclick="openProfileModal()">+ إضافة عضو</button>\` : ''}</div>
  <div class="maps-grid">
    \${store.team.map(u=>{
      let tCount=0, dCount=0;
      store.tasks.forEach(t=>t.stages.forEach(s=>{if(s.person===u.id){tCount++;if(['done','approved'].includes(s.state))dCount++;}}));
      const rate = tCount ? Math.round(dCount/tCount*100) : 0;
      return \`<div class="card fade-up" style="padding:20px;display:flex;flex-direction:column;align-items:center;gap:12px;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'" onclick="openProfileModal('\${u.id}')">
        <div style="width:70px;height:70px;border-radius:50%;background:\${u.av}18;color:\${u.av};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;">\${u.name[0]}</div>
        <div style="text-align:center;">
          <h3 style="margin:0;color:var(--ink-700)">\${esc(u.name)}</h3>
          <p style="margin:4px 0 0 0;color:var(--ink-500);font-size:14px">\${esc(u.role)}</p>
        </div>
        <div style="width:100%;height:1px;background:var(--line);margin:8px 0"></div>
        <div style="display:flex;width:100%;justify-content:space-between;font-size:13px;color:var(--ink-600)">
          <span>المهام: <strong>\${tCount}</strong></span>
          <span>الإنجاز: <strong style="color:var(--green-ok)">\${rate}%</strong></span>
        </div>
      </div>\`;
    }).join('')}
  </div>\`;
}

let profileEditId = null;
function openProfileModal(uid = null){
  const canEdit = ['الإدارة','مانيجر','كوردنيتر'].includes(userById(store.currentUser).role);
  profileEditId = uid;
  let u = uid ? store.team.find(x=>x.id===uid) : {id:'u'+Date.now(), name:'', role:'مصمم', av:'#3B6FF0', user:'', pass:''};
  
  const roles=['الإدارة','مانيجر','كوردنيتر','مصمم','كاتب محتوى','كاتب كابشن','مونتير','شريك خارجي'];
  
  let myTasksHTML = '';
  if(uid) {
    let mine=[];
    store.tasks.forEach(t=>t.stages.forEach(st=>{if(st.person===uid)mine.push({task:t,st});}));
    if(mine.length) {
      myTasksHTML = \`<h4 style="margin-top:20px;border-top:1px solid var(--line);padding-top:16px;">المهام الحالية (\${mine.length})</h4>
      <div style="max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
        \${mine.map(m=>\`<div style="background:var(--surface-2);padding:10px;border-radius:6px;font-size:13px;">
          <strong>\${esc(m.task.title)}</strong> - \${(STAGE_KINDS[m.st.kind]||{ar:'غير معروف'}).ar}
          <span style="float:left;color:\${m.st.state==='done'?'var(--green-ok)':'var(--amber)'}">\${m.st.state==='done'?'منجز':'قيد العمل'}</span>
        </div>\`).join('')}
      </div>\`;
    } else {
      myTasksHTML = \`<div style="margin-top:20px;color:var(--ink-500);font-size:14px;text-align:center;">لا توجد مهام حالية</div>\`;
    }
  }

  const m=document.createElement('div');
  m.className='modal-overlay';
  m.innerHTML=\`<div class="modal fade-up" style="max-width:500px;">
    <div class="modal-head"><h3>\${uid ? 'ملف الموظف' : 'إضافة موظف جديد'}</h3><button class="modal-close" onclick="closeProfileModal()">\${icon('cross',20)}</button></div>
    <div class="modal-body" style="display:flex;flex-direction:column;gap:16px;">
      <label class="tmap-f"><span>الاسم الكامل</span><input type="text" id="prof_name" value="\${esc(u.name)}" \${!canEdit?'disabled':''}></label>
      <label class="tmap-f"><span>الدور (المنصب)</span>
        <select id="prof_role" \${!canEdit?'disabled':''}>
          \${roles.map(r=>\`<option \${u.role===r?'selected':''}>\${r}</option>\`).join('')}
        </select>
      </label>
      <div style="display:flex;gap:16px;">
        <label class="tmap-f" style="flex:1"><span>اسم المستخدم (Login)</span><input type="text" id="prof_user" value="\${esc(u.user||'')}" \${!canEdit?'disabled':''}></label>
        <label class="tmap-f" style="flex:1"><span>كلمة المرور (Password)</span><input type="text" id="prof_pass" value="\${esc(u.pass||'')}" \${!canEdit?'disabled':''}></label>
      </div>
      <label class="tmap-f"><span>اللون الرمزي</span><input type="color" id="prof_av" value="\${u.av}" \${!canEdit?'disabled':''} style="width:100%;height:40px;border:none;border-radius:6px;cursor:pointer;"></label>
      \${myTasksHTML}
    </div>
    \${canEdit ? \`<div class="modal-foot">
      \${uid && uid !== store.currentUser ? \`<button class="btn-sm" style="color:var(--red);background:var(--red-soft);" onclick="deleteProfile('\${uid}')">حذف الموظف</button>\` : '<div></div>'}
      <button class="pill-blue" onclick="saveProfile()">\${uid ? '✓ حفظ التعديلات' : '✓ إضافة الموظف'}</button>
    </div>\` : ''}
  </div>\`;
  document.getElementById('modalRoot').appendChild(m);
}
function closeProfileModal(){document.getElementById('modalRoot').innerHTML=''; profileEditId=null;}
function saveProfile(){
  const name = document.getElementById('prof_name').value.trim();
  const role = document.getElementById('prof_role').value;
  const user = document.getElementById('prof_user').value.trim();
  const pass = document.getElementById('prof_pass').value.trim();
  const av = document.getElementById('prof_av').value;
  
  if(!name || !user || !pass) { alert('الرجاء تعبئة جميع الحقول المطلوبة'); return; }
  
  if(profileEditId) {
    const u = store.team.find(x=>x.id===profileEditId);
    if(u) { u.name=name; u.role=role; u.user=user; u.pass=pass; u.av=av; }
  } else {
    store.team.push({id:'u'+Date.now(), name, role, user, pass, av});
  }
  save(); closeProfileModal(); render();
}
function deleteProfile(uid) {
  if(confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
    store.team = store.team.filter(x=>x.id!==uid);
    save(); closeProfileModal(); render();
  }
}
`;
html = html.replace(/function viewTeam\(\)\{[\s\S]*?return `<div class="set-grid">/, newViewTeam + '\nfunction viewSettings(){ return `<div class="set-grid">');

fs.writeFileSync('index.html', html);
console.log('App patched successfully');
