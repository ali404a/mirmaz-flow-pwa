// --- SHEET MODULE ---
let sheetEditId = null;
function openSheetTaskModal(taskId) {
  sheetEditId = taskId;
  const t = store.tasks.find(x => x.id === taskId);
  if (!t) return;
  
  const capSt = t.stages.find(s => s.kind === 'caption') || {};
  const desSt = t.stages.find(s => s.kind === 'design') || {};
  const vidSt = t.stages.find(s => s.kind === 'video') || {};

  document.getElementById('modalRoot').innerHTML = `<div class="ov" onclick="if(event.target===this)closeSheetModal()">
    <div class="modal fade-up" style="max-width:600px;">
      <div class="modal-head">
        <h3>تعديل سريع للشيت</h3>
        <button class="modal-close" onclick="closeSheetModal()">✕</button>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:12px;padding:20px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <label class="tmap-f"><span>الاستاذ / العنوان</span><input type="text" id="sh_teacher" value="${esc(t.title||'')}"></label>
          <label class="tmap-f">
            <span>الاعتماد (Approval)</span>
            <select id="sh_approval" style="padding:8px;border:1px solid var(--line);border-radius:6px;font-family:inherit;">
              <option value="" ${!t.sheetApproval ? 'selected' : ''}>غير محدد</option>
              <option value="Approved" ${t.sheetApproval === 'Approved' ? 'selected' : ''}>Approved</option>
              <option value="Rejected" ${t.sheetApproval === 'Rejected' ? 'selected' : ''}>Rejected</option>
              <option value="FALSE" ${t.sheetApproval === 'FALSE' ? 'selected' : ''}>FALSE</option>
              <option value="Hold" ${t.sheetApproval === 'Hold' ? 'selected' : ''}>Hold</option>
            </select>
          </label>
          <label class="tmap-f"><span>موعد التسليم (Deadline)</span><input type="text" id="sh_deadline" value="${esc(t.due||'')}"></label>
          <label class="tmap-f"><span>حالة التحديث (Update)</span><input type="text" id="sh_update" value="${esc(t.sheetUpdate||'')}"></label>
        </div>
        <label class="tmap-f"><span>الكابشن والتايتل (Caption)</span><textarea id="sh_caption" rows="4">${esc(capSt.text||'')}</textarea></label>
        <label class="tmap-f"><span>البريف (Brief)</span><textarea id="sh_brief" rows="2">${esc(t.desc||'')}</textarea></label>
        <label class="tmap-f"><span>الصورة المصغرة (Thumbnail Link)</span><input type="text" id="sh_thumbnail" value="${esc(desSt.link||'')}"></label>
        <label class="tmap-f"><span>الفيديو (Video Link)</span><input type="text" id="sh_video" value="${esc(vidSt.link||'')}"></label>
        <label class="tmap-f"><span>الملاحظات (Comments)</span><textarea id="sh_comments" rows="2">${esc(t.coordNote||'')}</textarea></label>
      </div>
      <div class="modal-foot">
        <button class="pill-blue" onclick="saveSheetItem()">✓ حفظ وتحديث المهمة</button>
      </div>
    </div>
  </div>`;
}
function closeSheetModal() { document.getElementById('modalRoot').innerHTML = ''; sheetEditId = null; }

function saveSheetItem() {
  const t = store.tasks.find(x => x.id === sheetEditId);
  if (!t) return;
  
  t.title = document.getElementById('sh_teacher').value.trim();
  t.desc = document.getElementById('sh_brief').value.trim();
  t.due = document.getElementById('sh_deadline').value.trim();
  t.sheetApproval = document.getElementById('sh_approval').value.trim();
  t.coordNote = document.getElementById('sh_comments').value.trim();
  t.sheetUpdate = document.getElementById('sh_update').value.trim();
  
  const capSt = t.stages.find(s => s.kind === 'caption');
  if (capSt) capSt.text = document.getElementById('sh_caption').value.trim();
  
  const desSt = t.stages.find(s => s.kind === 'design');
  if (desSt) desSt.link = document.getElementById('sh_thumbnail').value.trim();
  
  const vidSt = t.stages.find(s => s.kind === 'video');
  if (vidSt) vidSt.link = document.getElementById('sh_video').value.trim();
  
  save(); closeSheetModal(); render();
}

function getApprStyle(val) {
  if (val === 'Approved') return 'background:var(--green-soft);color:var(--green-ok);';
  if (val === 'Rejected') return 'background:var(--red-soft);color:var(--red);';
  if (val === 'Hold') return 'background:var(--amber-soft);color:var(--amber);';
  if (val === 'FALSE') return 'background:var(--surface-2);color:var(--ink-700);';
  return 'background:var(--line);color:var(--ink-900);';
}

function viewSheet() {
  const tasks = getVisibleTasks();
  const canEdit = ['الإدارة','مانيجر','كوردنيتر'].includes(userById(store.currentUser).role);
  
  if (window.innerWidth <= 768) {
    return `<div class="maps-bar fade-up"><div class="maps-count"><strong>${tasks.length}</strong> صفوف</div>${canEdit ? `<button class="pill-blue" onclick="openTaskModal()">+ إضافة صف (مهمة)</button>` : ''}</div>
    ${tasks.length ? `<div style="display:flex;flex-direction:column;gap:12px;padding:0 16px 20px;">${tasks.map(t => {
      const capSt = t.stages.find(s => s.kind === 'caption') || {};
      return `<div class="card" style="padding:16px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <h4 style="color:var(--blue-600);margin:0">${esc(t.title||'بدون اسم')}</h4>
          ${canEdit ? `<button class="btn-sm" style="color:var(--ink-500);background:var(--line)" onclick="openSheetTaskModal('${t.id}')">${icon('edit',14)} تعديل</button>` : ''}
        </div>
        ${t.sheetApproval ? `<div style="font-size:13px"><span class="chip" style="${getApprStyle(t.sheetApproval)}">${esc(t.sheetApproval)}</span></div>` : ''}
        ${capSt.text ? `<div style="font-size:13px;background:var(--surface-2);padding:8px;border-radius:6px;white-space:pre-wrap">${esc(capSt.text)}</div>` : ''}
        ${t.sheetUpdate ? `<div style="font-size:13px;color:var(--amber)"><strong>التحديث:</strong> ${esc(t.sheetUpdate)}</div>` : ''}
      </div>`;
    }).join('')}</div>` : `<div class="empty card">لا توجد بيانات في الشيت</div>`}`;
  }
  
  return `<div class="maps-bar fade-up" style="margin-bottom:12px;"><div class="maps-count"><strong>${tasks.length}</strong> صفوف</div>${canEdit ? `<button class="pill-blue" onclick="openTaskModal()">+ إضافة صف (مهمة)</button>` : ''}</div>
  <div class="card fade-up" style="overflow-x:auto;max-height:calc(100vh - 120px);">
    <table class="sh-table" style="width:100%;border-collapse:collapse;min-width:1200px;font-size:13px;text-align:right;">
      <thead style="background:var(--surface-2);position:sticky;top:0;z-index:10;box-shadow:0 1px 0 var(--line);">
        <tr>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:120px;">الاستاذ</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:150px;">Brief</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:250px;">Caption / Title</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:90px;">Thumbnail</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:90px;">Video</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:100px;">Deadline</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:100px;">Approval</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:150px;">Comments</th>
          <th style="padding:10px;border-bottom:1px solid var(--line);min-width:150px;">Update</th>
          ${canEdit ? `<th style="padding:10px;border-bottom:1px solid var(--line);min-width:60px;">إجراء</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${tasks.length ? tasks.map(t => {
          const capSt = t.stages.find(s => s.kind === 'caption') || {};
          const desSt = t.stages.find(s => s.kind === 'design') || {};
          const vidSt = t.stages.find(s => s.kind === 'video') || {};
          return `<tr style="border-bottom:1px solid var(--line);transition:background 0.2s;" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'">
            <td style="padding:10px;font-weight:600;">${esc(t.title)}</td>
            <td style="padding:10px;white-space:pre-wrap;color:var(--ink-600)">${esc(t.desc)}</td>
            <td style="padding:10px;white-space:pre-wrap;background:var(--bg);border-radius:4px;margin:4px 0;">${esc(capSt.text||'')}</td>
            <td style="padding:10px;">${desSt.link ? `<a href="${desSt.link}" target="_blank" class="chip" style="background:var(--blue-50);color:var(--blue-600);text-decoration:none;">رابط 🔗</a>` : ''}</td>
            <td style="padding:10px;">${vidSt.link ? `<a href="${vidSt.link}" target="_blank" class="chip" style="background:var(--blue-50);color:var(--blue-600);text-decoration:none;">رابط 🔗</a>` : ''}</td>
            <td style="padding:10px;color:var(--red)">${esc(t.due||'')}</td>
            <td style="padding:10px;">${t.sheetApproval ? `<span class="chip" style="${getApprStyle(t.sheetApproval)}">${esc(t.sheetApproval)}</span>` : ''}</td>
            <td style="padding:10px;white-space:pre-wrap;">${esc(t.coordNote||'')}</td>
            <td style="padding:10px;white-space:pre-wrap;color:var(--amber)">${esc(t.sheetUpdate||'')}</td>
            ${canEdit ? `<td style="padding:10px;"><button class="btn-sm" style="background:var(--line);color:var(--ink-600)" onclick="openSheetTaskModal('${t.id}')">${icon('edit', 14)}</button></td>` : ''}
          </tr>`;
        }).join('') : `<tr><td colspan="${canEdit ? 10 : 9}" style="padding:20px;text-align:center;color:var(--ink-500);">لا توجد بيانات</td></tr>`}
      </tbody>
    </table>
  </div>`;
}
