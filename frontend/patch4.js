const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
  `function openFromMy(tid,sid){page='maps';openNode={};openNode[tid]=sid;render();}`,
  `function openFromMy(tid,sid){const t=store.tasks.find(x=>x.id===tid);page=t&&t.isPartnership?'partnerships':'maps';openNode={};openNode[tid]=sid;render();}`
);

fs.writeFileSync('index.html', content);
console.log('Patched openFromMy');
