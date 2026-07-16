// --- SHEET MODULE ---
let sheetEditId = null;
function openSheetModal(id = null) {
  sheetEditId = id;
  const item = id ? store.sheet.find(x => x.id === id) : { teacher: '', brief: '', date: '', time: '', caption: '', thumbnail: '', video: '', deadline: '', approval: '', comments: '', update: '' };
  
  const m = document.createElement('div');
  m.className = 'modal-ov fade-up';
  m.innerHTML = `<div class="modal"><div class="modal-head"><h3>${id ? 'تعديل الصف' : 'إضافة صف جديد'}</h3><button class="modal-close" onclick="closeSheetModal()">✕</button></div>
  <div class="modal-body" style="display:flex;flex-direction:column;gap:12px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <label class="tmap-f"><span>الاستاذ</span><input type="text" id="sh_teacher" value="${esc(item.teacher||'')}"></label>
      <label class="tmap-f"><span>الاعتماد (Approval)</span><input type="text" id="sh_approval" value="${esc(item.approval||'')}"></label>
      <label class="tmap-f"><span>التاريخ</span><input type="text" id="sh_date" value="${esc(item.date||'')}"></label>
      <label class="tmap-f"><span>الوقت</span><input type="text" id="sh_time" value="${esc(item.time||'')}"></label>
      <label class="tmap-f"><span>موعد التسليم (Deadline)</span><input type="text" id="sh_deadline" value="${esc(item.deadline||'')}"></label>
      <label class="tmap-f"><span>حالة التحديث (Update)</span><input type="text" id="sh_update" value="${esc(item.update||'')}"></label>
    </div>
    <label class="tmap-f"><span>الكابشن والتايتل (Caption)</span><textarea id="sh_caption" rows="4">${esc(item.caption||'')}</textarea></label>
    <label class="tmap-f"><span>البريف (Brief)</span><textarea id="sh_brief" rows="2">${esc(item.brief||'')}</textarea></label>
    <label class="tmap-f"><span>الصورة المصغرة (Thumbnail Link)</span><input type="text" id="sh_thumbnail" value="${esc(item.thumbnail||'')}"></label>
    <label class="tmap-f"><span>الفيديو (Video Link)</span><input type="text" id="sh_video" value="${esc(item.video||'')}"></label>
    <label class="tmap-f"><span>الملاحظات (Comments)</span><textarea id="sh_comments" rows="2">${esc(item.comments||'')}</textarea></label>
  </div>
  <div class="modal-foot">${id ? `<button class="btn-sm" style="color:var(--red)" onclick="deleteSheetItem('${id}')">حذف الصف</button>` : ''}<button class="pill-blue" onclick="saveSheetItem()">✓ حفظ</button></div></div>`;
  document.getElementById('modalRoot').appendChild(m);
}
function closeSheetModal() { document.getElementById('modalRoot').innerHTML = ''; sheetEditId = null; }
function saveSheetItem() {
  const item = {
    id: sheetEditId || 'sh' + Date.now(),
    teacher: document.getElementById('sh_teacher').value.trim(),
    brief: document.getElementById('sh_brief').value.trim(),
    date: document.getElementById('sh_date').value.trim(),
    time: document.getElementById('sh_time').value.trim(),
    caption: document.getElementById('sh_caption').value.trim(),
    thumbnail: document.getElementById('sh_thumbnail').value.trim(),
    video: document.getElementById('sh_video').value.trim(),
    deadline: document.getElementById('sh_deadline').value.trim(),
    approval: document.getElementById('sh_approval').value.trim(),
    comments: document.getElementById('sh_comments').value.trim(),
    update: document.getElementById('sh_update').value.trim()
  };
  if (sheetEditId) {
    const idx = store.sheet.findIndex(x => x.id === sheetEditId);
    if (idx !== -1) store.sheet[idx] = item;
  } else {
    store.sheet.push(item);
  }
  save(); closeSheetModal(); render();
}
function deleteSheetItem(id) {
  if(!confirm('هل أنت متأكد من حذف هذا الصف؟')) return;
  store.sheet = store.sheet.filter(x => x.id !== id);
  save(); closeSheetModal(); render();
}

function viewSheet() {
  const items = store.sheet || [];
  const canEdit = ['الإدارة','مانيجر','كوردنيتر'].includes(userById(store.currentUser).role);
  
  if (window.innerWidth <= 768) {
    return `<div class="maps-bar fade-up"><div class="maps-count"><strong>${items.length}</strong> صفوف</div>${canEdit ? `<button class="pill-blue" onclick="openSheetModal()">+ إضافة صف</button>` : ''}</div>
    ${items.length ? `<div style="display:flex;flex-direction:column;gap:12px;padding:0 16px 20px;">${items.map(r => 
      `<div class="card" style="padding:16px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <h4 style="color:var(--blue-600);margin:0">${esc(r.teacher||'بدون اسم')}</h4>
          ${canEdit ? `<button class="btn-sm" style="color:var(--ink-500);background:var(--line)" onclick="openSheetModal('${r.id}')">${icon('edit',14)} تعديل</button>` : ''}
        </div>
        ${r.approval ? `<div style="font-size:13px"><span class="chip" style="background:var(--line)">الاعتماد: ${esc(r.approval)}</span></div>` : ''}
        ${r.caption ? `<div style="font-size:13px;background:var(--surface-2);padding:8px;border-radius:6px;white-space:pre-wrap">${esc(r.caption)}</div>` : ''}
        ${r.update ? `<div style="font-size:13px;color:var(--amber)"><strong>التحديث:</strong> ${esc(r.update)}</div>` : ''}
      </div>`
    ).join('')}</div>` : `<div class="empty card">لا توجد بيانات في الشيت</div>`}`;
  }
  
  return `<div class="maps-bar fade-up" style="margin-bottom:12px;"><div class="maps-count"><strong>${items.length}</strong> صفوف</div>${canEdit ? `<button class="pill-blue" onclick="openSheetModal()">+ إضافة صف</button>` : ''}</div>
  <div class="card fade-up" style="overflow-x:auto;max-height:calc(100vh - 120px);">
    <table class="sh-table" style="width:100%;border-collapse:collapse;min-width:1200px;font-size:13px;text-align:right;">
      <thead style="background:var(--surface-2);position:sticky;top:0;z-index:10;box-shadow:0 1px 0 var(--line);">
        <tr>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:120px;">الاستاذ</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:150px;">Brief</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:80px;">Date</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:70px;">Time</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:250px;">Caption / Title</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:100px;">Thumbnail</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:100px;">Video</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:100px;">Deadline</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:100px;">Approval</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:150px;">Comments</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:150px;">Update</th>
          ${canEdit ? `<th style="padding:10px;border-bottom:1px solid var(--line);min-width:60px;">إجراء</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${items.length ? items.map(r => `<tr style="border-bottom:1px solid var(--line);transition:background 0.2s;" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'">
          <td style="padding:10px;font-weight:600;">${esc(r.teacher)}</td>
          <td style="padding:10px;white-space:pre-wrap;color:var(--ink-600)">${esc(r.brief)}</td>
          <td style="padding:10px;">${esc(r.date)}</td>
          <td style="padding:10px;">${esc(r.time)}</td>
          <td style="padding:10px;white-space:pre-wrap;background:var(--bg);border-radius:4px;margin:4px 0;">${esc(r.caption)}</td>
          <td style="padding:10px;">${r.thumbnail ? `<a href="${r.thumbnail}" target="_blank" style="color:var(--blue-500)">رابط 🔗</a>` : ''}</td>
          <td style="padding:10px;">${r.video ? `<a href="${r.video}" target="_blank" style="color:var(--blue-500)">رابط 🔗</a>` : ''}</td>
          <td style="padding:10px;color:var(--red)">${esc(r.deadline)}</td>
          <td style="padding:10px;">${r.approval ? `<span class="chip" style="background:var(--line)">${esc(r.approval)}</span>` : ''}</td>
          <td style="padding:10px;white-space:pre-wrap;">${esc(r.comments)}</td>
          <td style="padding:10px;white-space:pre-wrap;color:var(--amber)">${esc(r.update)}</td>
          ${canEdit ? `<td style="padding:10px;"><button class="btn-sm" style="background:var(--line);color:var(--ink-600)" onclick="openSheetModal('${r.id}')">${icon('edit', 14)}</button></td>` : ''}
        </tr>`).join('') : `<tr><td colspan="${canEdit ? 12 : 11}" style="padding:20px;text-align:center;color:var(--ink-500);">لا توجد بيانات</td></tr>`}
      </tbody>
    </table>
  </div>`;
}
