const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Revert BRANDS
content = content.replace(
  `zone:{id:'zone',name:'mirmaz Zone',emoji:'⚡',color:'#7B3FF2',soft:'#EFE6FF'},partners:{id:'partners',name:'الشراكات',emoji:'🤝',color:'#0FB67E',soft:'#E5F8F0'}}`,
  `zone:{id:'zone',name:'mirmaz Zone',emoji:'⚡',color:'#7B3FF2',soft:'#EFE6FF'}}`
);

// Revert brandCount
content = content.replace(
  `const brandCount={academy:0,zone:0,partners:0};`,
  `const brandCount={academy:0,zone:0};`
);

// Revert byBrand
content = content.replace(
  `const byBrand={academy:{total:0,done:0},zone:{total:0,done:0},partners:{total:0,done:0}};`,
  `const byBrand={academy:{total:0,done:0},zone:{total:0,done:0}};`
);

fs.writeFileSync('index.html', content);
console.log('Cleaned up partners brand artifacts');
