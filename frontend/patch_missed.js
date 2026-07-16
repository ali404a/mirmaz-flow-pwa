const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Sidebar Logout Button (After <div class="sb-summary glass-card" id="sbSummary"></div>)
if(!html.includes('onclick="logout()"')) {
  html = html.replace(/(<div class="sb-summary glass-card" id="sbSummary"><\/div>)/, '$1\n      <div style="margin-top:auto;padding-top:16px"><button onclick="logout()" style="width:100%;padding:12px;background:var(--red-soft);color:var(--red);border:none;border-radius:8px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">${icon("cross", 16)} تسجيل الخروج</button></div>');
}

// 2. Home Page Clickable stat cards
// Original: `<div class="stat-row fade-up">${stats.map(s=>`<div class="stat">`
if(!html.includes('onclick="if(s.query)')) {
  html = html.replace(/<div class="stat">/g, '<div class="stat" style="cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 8px 24px rgba(0,0,0,0.08)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'none\'" onclick="if(s.query) { searchQuery = s.query; } go(s.page)">');
}

// 3. Redesign circular charts in ring()
// Original: const ring=(r)=>{const R=30,C=2*Math.PI*R,off=C-(r.v/100)*C; return `<div class="ring"><svg width="76" height="76"><circle cx="38" cy="38" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="12"/><circle cx="38" cy="38" r="${R}" fill="none" stroke="${r.c}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}"/></svg><div class="rval" style="margin-top:-50px;color:${r.c}">${r.v}%</div><p style="margin-top:30px">${r.l}</p></div>`;};
const newRing = `const ring=(r)=>{const R=38,C=2*Math.PI*R,off=C-(r.v/100)*C;
    return \`<div class="ring" style="position:relative;display:flex;flex-direction:column;align-items:center;padding:12px;background:var(--surface);border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.05);flex:1">
      <svg width="90" height="90" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
        <defs>
          <linearGradient id="g-\${r.c.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="\${r.c}" />
            <stop offset="100%" stop-color="\${r.c}88" />
          </linearGradient>
        </defs>
        <circle cx="45" cy="45" r="\${R}" fill="none" stroke="var(--surface-2)" stroke-width="12"/>
        <circle cx="45" cy="45" r="\${R}" fill="none" stroke="url(#g-\${r.c.replace('#','')})" stroke-width="12" stroke-linecap="round" stroke-dasharray="\${C}" stroke-dashoffset="\${off}"/>
      </svg>
      <div class="rval" style="position:absolute;top:45px;color:\${r.c};font-size:20px;font-weight:800;transform:translateY(-50%);">\${r.v}%</div>
      <p style="margin:16px 0 0 0;font-weight:bold;color:var(--ink-700);font-size:13px">\${r.l}</p>
    </div>\`;
  };`;

html = html.replace(/const ring=\(r\)=>\{[\s\S]*?<\/div>\`;\};/, newRing);

fs.writeFileSync('index.html', html);
console.log('Applied missed patches');
