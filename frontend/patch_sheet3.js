const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const sheetJs = fs.readFileSync('sheet.js', 'utf8');

// Replace everything from `// --- SHEET MODULE ---` to just before `let page='home';`
content = content.replace(/\/\/ --- SHEET MODULE ---[\s\S]*?(?=let page='home';)/, sheetJs + '\n');

fs.writeFileSync('index.html', content);
console.log('Patched index.html with fixed modal and styling.');
