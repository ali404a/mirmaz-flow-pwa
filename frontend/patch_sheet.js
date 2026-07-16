const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const sheetJs = fs.readFileSync('sheet.js', 'utf8');

// 1. Add SVG sheet icon
content = content.replace(
  `const SVG={`,
  `const SVG={\n  sheet:'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/>',`
);

// 2. Add to store
content = content.replace(
  `if(!d.chat)d.chat=defaultChat();return d;`,
  `if(!d.chat)d.chat=defaultChat();if(!d.sheet)d.sheet=[];return d;`
);
content = content.replace(
  `chat:defaultChat(),currentUser:'u3'}`,
  `chat:defaultChat(),sheet:[],currentUser:'u3'}`
);

// 3. Add to NAV
content = content.replace(
  `{id:'partnerships',title:'الشراكات',svg:'team'},`,
  `{id:'partnerships',title:'الشراكات',svg:'team'},\n  {id:'sheet',title:'الشيت',svg:'sheet'},`
);

// 4. Add to META
content = content.replace(
  `partnerships:['الشراكات','المهام المخصصة للشركات الخارجية وشركاء مرماز'],`,
  `partnerships:['الشراكات','المهام المخصصة للشركات الخارجية وشركاء مرماز'],sheet:['الشيت 📋','جدول المهام والتفاصيل الخاصة للأساتذة'],`
);

// 5. Inject sheet.js before let page='home';
content = content.replace(`let page='home';`, sheetJs + `\nlet page='home';`);

// 6. Add viewSheet to render routing
content = content.replace(
  `else if(page==='partnerships')v.innerHTML=viewPartnerships();`,
  `else if(page==='partnerships')v.innerHTML=viewPartnerships();else if(page==='sheet')v.innerHTML=viewSheet();`
);

fs.writeFileSync('index.html', content);
console.log('Patched index.html for Sheet');
