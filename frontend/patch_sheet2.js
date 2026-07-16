const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const seededTasks = fs.readFileSync('seeded_tasks.json', 'utf8');
const sheetJs = fs.readFileSync('sheet.js', 'utf8');

// Replace everything from `// --- SHEET MODULE ---` to just before `let page='home';`
content = content.replace(/\/\/ --- SHEET MODULE ---[\s\S]*?(?=let page='home';)/, sheetJs + '\n');

// Inject seeded tasks into `load()` function if not seeded
// Find `if(!d.chat)d.chat=defaultChat();if(!d.sheet)d.sheet=[];return d;`
content = content.replace(
  `if(!d.chat)d.chat=defaultChat();if(!d.sheet)d.sheet=[];return d;`,
  `if(!d.chat)d.chat=defaultChat();if(!d.sheet)d.sheet=[];if(!d.tasks.find(x=>x.isSeeded2026)){d.tasks.push(...${seededTasks});d.tasks.forEach(t=>t.isSeeded2026=true);}return d;`
);

// Add them to `seedTasks()` so new users get them
content = content.replace(
  `return arr;}`,
  `return [...arr, ...${seededTasks}.map(t=>({...t, isSeeded2026:true}))];}`
);

fs.writeFileSync('index.html', content);
console.log('Patched index.html with new sheet architecture and seeded tasks');
