const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Roles
content = content.replace(
  `const roles=['الإدارة','مانيجر','كوردنيتر','مصمم','كاتب محتوى','كاتب كابشن','مونتير'];`,
  `const roles=['الإدارة','مانيجر','كوردنيتر','مصمم','كاتب محتوى','كاتب كابشن','مونتير','شريك خارجي'];`
);

// 2. NAV array
content = content.replace(
  `{id:'maps',title:'خرائط المهام',svg:'maps'},`,
  `{id:'maps',title:'خرائط المهام',svg:'maps'},\n  {id:'partnerships',title:'الشراكات',svg:'team'},`
);

// 3. renderNav
content = content.replace(
  `function renderNav(){
  const unread=store.notifications?store.notifications.filter(n=>!n.read).length:0;
  document.getElementById('sbNav').innerHTML=NAV.map(n=>{`,
  `function renderNav(){
  const unread=store.notifications?store.notifications.filter(n=>!n.read).length:0;
  const u = userById(store.currentUser);
  let navItems = NAV;
  if(u && u.role === 'شريك خارجي') { navItems = NAV.filter(n => ['partnerships', 'settings', 'notifications'].includes(n.id)); }
  document.getElementById('sbNav').innerHTML=navItems.map(n=>{`
);

// 4. bottomNav in renderNav
content = content.replace(
  `const mobileNavIds = ['home', 'maps', 'mytasks', 'notifications'];
    let bnHtml = NAV.filter(n => mobileNavIds.includes(n.id)).map(n=>{`,
  `let mobileNavIds = ['home', 'maps', 'mytasks', 'notifications'];
    const u = userById(store.currentUser);
    if (u && u.role === 'شريك خارجي') mobileNavIds = ['partnerships', 'settings', 'notifications'];
    let bnHtml = NAV.filter(n => mobileNavIds.includes(n.id)).map(n=>{`
);

// 5. META
content = content.replace(
  `maps:['خرائط المهام','كل تاسك خريطته الخاصة — اضغط أي مرحلة لفتحها وإضافة محتواها']`,
  `maps:['خرائط المهام','كل تاسك خريطته الخاصة — اضغط أي مرحلة لفتحها وإضافة محتواها'],partnerships:['الشراكات','المهام المخصصة للشركات الخارجية وشركاء مرماز']`
);

// 6. render page injection and default routing
content = content.replace(
  `function render(){
  document.getElementById('pageTitle').textContent=META[page][0];`,
  `function render(){
  const u = userById(store.currentUser);
  if (u && u.role === 'شريك خارجي' && !['partnerships','settings','notifications'].includes(page)) page = 'partnerships';
  document.getElementById('pageTitle').textContent=META[page][0];`
);

// 7. view rendering
content = content.replace(
  `else if(page==='maps')v.innerHTML=viewMaps();`,
  `else if(page==='maps')v.innerHTML=viewMaps();else if(page==='partnerships')v.innerHTML=viewPartnerships();`
);

// 8. viewMaps filtering
content = content.replace(
  `function viewMaps(){
  let tasks=[...getVisibleTasks()].sort((a,b)=>PRIORITIES[b.priority].rank-PRIORITIES[a.priority].rank);`,
  `function viewMaps(){
  let tasks=[...getVisibleTasks()].filter(t=>!t.isPartnership).sort((a,b)=>PRIORITIES[b.priority].rank-PRIORITIES[a.priority].rank);`
);

// 9. openTaskModal param inside viewMaps
content = content.replace(
  `class="pill-blue" onclick="openTaskModal()">+ تاسك جديد</button>\`:''}</div>\${tasks.length?\`<div class="maps-grid">\${tasks.map(taskMap).join('')}</div>\`:'<div class="empty card">لا توجد نتائج مطابقة للبحث</div>'}\`;
}`,
  `class="pill-blue" onclick="openTaskModal()">+ تاسك جديد</button>\`:''}</div>\${tasks.length?\`<div class="maps-grid">\${tasks.map(taskMap).join('')}</div>\`:'<div class="empty card">لا توجد نتائج مطابقة للبحث</div>'}\`;
}
function viewPartnerships(){
  let tasks=[...getVisibleTasks()].filter(t=>t.isPartnership).sort((a,b)=>PRIORITIES[b.priority].rank-PRIORITIES[a.priority].rank);
  if(searchQuery){const q=searchQuery.trim();
    tasks=tasks.filter(t=>t.title.includes(q)||t.desc.includes(q)||BRANDS[t.brand].name.includes(q)||t.stages.some(s=>s.person&&userById(s.person).name.includes(q)));}
  const critN=tasks.filter(t=>t.priority==='critical').length;
  const canCreate=['كوردنيتر','مانيجر','الإدارة'].includes(userById(store.currentUser).role);
  return \`<div class="maps-bar fade-up"><div class="maps-count"><strong>\${tasks.length}</strong> شراكة \${searchQuery?\`<span class="crit-tag" style="background:var(--blue-50);color:var(--blue-600)">🔍 "\${esc(searchQuery)}"\</span>\`:\'\'} \${critN?\`<span class="crit-tag">🔥 \${critN} قصوى</span>\`:\'\'}</div>\${canCreate?\`<button class="pill-blue" onclick="openTaskModal(null,true)">+ إضافة شراكة</button>\`:\'\'}</div>\${tasks.length?\`<div class="maps-grid">\${tasks.map(taskMap).join('')}</div>\`:'<div class="empty card">لا توجد شراكات</div>'}\`;
}`
);

// 10. openTaskModal update
content = content.replace(
  `function openTaskModal(editId){
  tEditId=editId||null;`,
  `function openTaskModal(editId, isPartnership = false){
  tEditId=editId||null;`
);
content = content.replace(
  `tForm={brand:t.brand,priority:t.priority,title:t.title,desc:t.desc,due:t.due,pubDate:pSt?pSt.publishDate||'':'',coordNote:t.coordNote||'',coordLink:t.coordLink||'',
      stages:t.stages.map(s=>({...s}))};`,
  `tForm={brand:t.brand,priority:t.priority,title:t.title,desc:t.desc,due:t.due,pubDate:pSt?pSt.publishDate||'':'',coordNote:t.coordNote||'',coordLink:t.coordLink||'',
      isPartnership: t.isPartnership,
      stages:t.stages.map(s=>({...s}))};`
);
content = content.replace(
  `tForm={brand:'academy',priority:'normal',title:'',desc:'',due:'2026-06-28',pubDate:'',coordNote:'',coordLink:'',
      stages:store.sections.map((kind,i)=>({id:'s'+(i+1),kind,person:'',state:'pending',text:'',note:'',link:'',reason:'',publishDate:''}))};`,
  `tForm={brand:'academy',priority:'normal',title:'',desc:'',due:'2026-06-28',pubDate:'',coordNote:'',coordLink:'',
      isPartnership,
      stages:store.sections.map((kind,i)=>({id:'s'+(i+1),kind,person:'',state:'pending',text:'',note:'',link:'',reason:'',publishDate:''}))};`
);

// 11. task saving in tSubmit
content = content.replace(
  `const task={id:'t'+Date.now(),brand:tForm.brand,priority:tForm.priority,title,desc,due,coordinator:store.currentUser,coordNote:tForm.coordNote,coordLink:tForm.coordLink,
      stages:tForm.stages.map(s=>({...s}))};`,
  `const task={id:'t'+Date.now(),brand:tForm.brand,priority:tForm.priority,title,desc,due,coordinator:store.currentUser,coordNote:tForm.coordNote,coordLink:tForm.coordLink,isPartnership:tForm.isPartnership,
      stages:tForm.stages.map(s=>({...s}))};`
);

// 12. Update getVisibleTasks to filter properly
content = content.replace(
  `function getVisibleTasks() {
  const u = userById(store.currentUser);
  if (u && u.role === 'شريك خارجي') {
    return store.tasks.filter(t => t.stages.some(s => s.person === u.id));
  }
  return store.tasks;
}`,
  `function getVisibleTasks() {
  const u = userById(store.currentUser);
  if (u && u.role === 'شريك خارجي') {
    return store.tasks.filter(t => t.isPartnership && t.stages.some(s => s.person === u.id));
  }
  return store.tasks;
}`
);

fs.writeFileSync('index.html', content);
console.log('Patched index.html');
