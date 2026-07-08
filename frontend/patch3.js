const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Fix tSubmit
content = content.replace(
  `const task={id:'t'+Date.now(),brand:tForm.brand,title,desc,due,priority:tForm.priority,coordinator:store.currentUser,coordNote,coordLink,stages:tForm.stages};`,
  `const task={id:'t'+Date.now(),brand:tForm.brand,title,desc,due,priority:tForm.priority,coordinator:store.currentUser,coordNote,coordLink,stages:tForm.stages,isPartnership:tForm.isPartnership};`
);

fs.writeFileSync('index.html', content);
console.log('Patched tSubmit');
