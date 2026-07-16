const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. In viewMaps(), filter out undefined b and p just in case
html = html.replace(
  /tasks=tasks\.filter\(t=>t\.title\.includes\(q\)\|\|t\.desc\.includes\(q\)\|\|\(BRANDS\[t\.brand\]\|\|\{name:'غير معروف',bg:'#eee',c:'#333'\}\)\.name\.includes\(q\)\|\|t\.stages\.some\(s=>s\.person&&userById\(s\.person\)\.name\.includes\(q\)\)\);}/,
  \`tasks=tasks.filter(t=>t.title.includes(q)||t.desc.includes(q)||(BRANDS[t.brand]||{name:'غير معروف'}).name.includes(q)||t.stages.some(s=>{ const u = userById(s.person); return u && u.name.includes(q); }));}\`
);

// 2. In taskMap(), add safe fallbacks
html = html.replace(
  /const b=BRANDS\[task\.brand\],p=PRIORITIES\[task\.priority\],coord=userById\(task\.coordinator\),crit=task\.priority==='critical';/,
  \`const b=BRANDS[task.brand]||{name:'غير معروف',emoji:'🏷',color:'#999',soft:'#f1f1f1'}, p=PRIORITIES[task.priority]||{name:'عادي',emoji:'🟢',color:'#999',rank:0}, coord=userById(task.coordinator)||{name:'غير محدد'}, crit=task.priority==='critical';\`
);

// Also in viewHome() for acts (recent activities)
html = html.replace(
  /const k=\(STAGE_KINDS\[st\.kind\]\|\|\{ar:'غير معروف',svg:'doc',color:'#999',hasText:true\}\),ns=NSTATE\[st\.state\],u=st\.person\?userById\(st\.person\):null;/,
  \`const k=(STAGE_KINDS[st.kind]||{ar:'غير معروف',svg:'doc',color:'#999',hasText:true}), ns=NSTATE[st.state]||{ar:'غير معروف',color:'#999'}, u=st.person?userById(st.person):null;\`
);

fs.writeFileSync('index.html', html);
console.log('Applied safe fallbacks');
