const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. BRANDS
content = content.replace(
  `zone:{id:'zone',name:'mirmaz Zone',emoji:'⚡',color:'#7B3FF2',soft:'#EFE6FF'}}`,
  `zone:{id:'zone',name:'mirmaz Zone',emoji:'⚡',color:'#7B3FF2',soft:'#EFE6FF'},partners:{id:'partners',name:'الشراكات',emoji:'🤝',color:'#0FB67E',soft:'#E5F8F0'}}`
);

// 2. getVisibleTasks function & renderSummary
content = content.replace(
  `}
function renderSummary(){
  const u=store.currentUser;
  let mine=0,done=0;
  store.tasks.forEach(t=>t.stages.forEach(st=>{if(st.person===u){mine++;if(['done','approved'].includes(st.state))done++;}}));
  const pct=mine?Math.round(done/mine*100):0;
  const totalTasks=store.tasks.length;
  const crit=store.tasks.filter(t=>t.priority==='critical').length;`,
  `}
function getVisibleTasks() {
  const u = userById(store.currentUser);
  if (u && u.role === 'شريك خارجي') {
    return store.tasks.filter(t => t.stages.some(s => s.person === u.id));
  }
  return store.tasks;
}
function renderSummary(){
  const u=store.currentUser;
  let mine=0,done=0;
  getVisibleTasks().forEach(t=>t.stages.forEach(st=>{if(st.person===u){mine++;if(['done','approved'].includes(st.state))done++;}}));
  const pct=mine?Math.round(done/mine*100):0;
  const totalTasks=getVisibleTasks().length;
  const crit=getVisibleTasks().filter(t=>t.priority==='critical').length;`
);

// 3. store.tasks replacements
content = content.replace(`function viewHome(){\n  const tasks=store.tasks;`, `function viewHome(){\n  const tasks=getVisibleTasks();`);
content = content.replace(`let tasks=[...store.tasks].sort`, `let tasks=[...getVisibleTasks()].sort`);
content = content.replace(`store.tasks.forEach(t=>t.stages.forEach(st=>{if(st.person===u)mine.push({task:t,st});}));`, `getVisibleTasks().forEach(t=>t.stages.forEach(st=>{if(st.person===u)mine.push({task:t,st});}));`);
content = content.replace(`store.tasks.forEach(t=>t.stages.forEach(st=>{\n    if(STAGE_KINDS[st.kind].isPublish`, `getVisibleTasks().forEach(t=>t.stages.forEach(st=>{\n    if(STAGE_KINDS[st.kind].isPublish`);
content = content.replace(`function viewAnalytics(){\n  const tasks=store.tasks;`, `function viewAnalytics(){\n  const tasks=getVisibleTasks();`);
content = content.replace(`store.tasks.forEach(t=>t.stages.forEach(st=>{if(st.person===u.id){total++;`, `getVisibleTasks().forEach(t=>t.stages.forEach(st=>{if(st.person===u.id){total++;`);

// 4. brandCount in viewHome
content = content.replace(`const brandCount={academy:0,zone:0};`, `const brandCount={academy:0,zone:0,partners:0};`);

// 5. byBrand in viewAnalytics
content = content.replace(
  `const byBrand={academy:{total:0,done:0},zone:{total:0,done:0}};`,
  `const byBrand={academy:{total:0,done:0},zone:{total:0,done:0},partners:{total:0,done:0}};`
);

// 6. Analytics HTML
content = content.replace(
  `<div class="stat-card"><b>Zone</b><span>\${byBrand.zone.done} / \${byBrand.zone.total}</span></div>\n    </div>`,
  `<div class="stat-card"><b>Zone</b><span>\${byBrand.zone.done} / \${byBrand.zone.total}</span></div>\n      <div class="stat-card"><b>الشراكات</b><span>\${byBrand.partners.done} / \${byBrand.partners.total}</span></div>\n    </div>`
);

// 7. roles
content = content.replace(
  `const roles=['الإدارة','مانيجر','كوردنيتر','مصمم','كاتب محتوى','كاتب كابشن','مونتير'];`,
  `const roles=['الإدارة','مانيجر','كوردنيتر','مصمم','كاتب محتوى','كاتب كابشن','مونتير','شريك خارجي'];`
);

fs.writeFileSync('index.html', content);
console.log('Patched successfully.');
