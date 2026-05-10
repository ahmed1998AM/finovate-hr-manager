const STORAGE_KEY = 'finovate_hr_suite_v1';
const defaultAdmin = { id: crypto.randomUUID(), name: 'System Admin', email: 'admin@finovate.local', password: 'admin123', role: 'manager' };
const initial = { users: [defaultAdmin], employees: [], attendance: [], tasks: [], assets: [], operations: [], session: null };
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(initial));

const $ = id => document.getElementById(id);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const monthKey = d => d?.slice(0, 7);
const nameOf = id => state.employees.find(e => e.id === id)?.name || '-';
const money = n => new Intl.NumberFormat('ar').format(Number(n || 0));

function ensureAdmin() {
  if (!state.users.some(u => u.role === 'manager')) state.users.push(defaultAdmin);
}

function currentUser() { return state.users.find(u => u.id === state.session); }

function refreshEmployeeSelectors() {
  ['attEmp','taskEmp','assetEmp','opEmp'].forEach(id => {
    const sel = $(id); sel.innerHTML = '';
    state.employees.forEach(e => { const o = document.createElement('option'); o.value = e.id; o.textContent = `${e.name} - ${e.department}`; sel.appendChild(o); });
  });
}

function renderDashboard() {
  const m = $('payrollMonth').value || new Date().toISOString().slice(0,7);
  const absences = state.attendance.filter(a => monthKey(a.date) === m && a.status === 'غائب').length;
  const html = [
    ['الموظفون', state.employees.length],
    ['الحسابات', state.users.length],
    ['المهام المفتوحة', state.tasks.filter(t => t.status !== 'مكتملة').length],
    ['العهد غير المستلمة', state.assets.filter(a => a.status !== 'مستلمة').length],
    ['العمليات المعلقة', state.operations.filter(o => o.status === 'قيد المراجعة').length],
    ['غياب الشهر', absences],
  ].map(x => `<article><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('');
  $('dashboardCards').innerHTML = html;
}

function renderEmployees() {
  $('employeesTable').innerHTML = state.employees.map(e => `<tr><td>${e.name}</td><td>${e.role}</td><td>${e.department}</td><td>${money(e.salary)}</td><td><button data-del-emp="${e.id}" class="danger">حذف</button></td></tr>`).join('');
  document.querySelectorAll('[data-del-emp]').forEach(b => b.onclick = () => { const id=b.dataset.delEmp; state.employees = state.employees.filter(e => e.id !== id); ['attendance','tasks','assets','operations'].forEach(k => state[k] = state[k].filter(i => i.employeeId !== id)); renderAll();});
}

function renderAccounts() {
  const user = currentUser();
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = user?.role === 'manager' ? '' : 'none');
  $('accountsTable').innerHTML = state.users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.role==='manager' ? '-' : `<button data-del-user="${u.id}" class="danger">حذف</button>`}</td></tr>`).join('');
  document.querySelectorAll('[data-del-user]').forEach(b => b.onclick = () => { state.users = state.users.filter(u => u.id !== b.dataset.delUser); renderAll(); });
}

function renderTasks() {
  $('tasksTable').innerHTML = state.tasks.map(t => `<tr><td>${nameOf(t.employeeId)}</td><td>${t.title}</td><td>${t.dueDate||'-'}</td><td><span class="badge ${t.status==='مكتملة'?'ok':'warn'}">${t.status}</span></td><td><button data-done-task="${t.id}">مكتملة</button></td></tr>`).join('');
  document.querySelectorAll('[data-done-task]').forEach(b => b.onclick = () => { const t=state.tasks.find(x=>x.id===b.dataset.doneTask); if(t) t.status='مكتملة'; renderAll(); });
}

function renderAssets() {
  $('assetsTable').innerHTML = state.assets.map(a => `<tr><td>${nameOf(a.employeeId)}</td><td>${a.name}</td><td>${a.date||'-'}</td><td>${a.status}</td><td><button data-rec-asset="${a.id}">استلام</button></td></tr>`).join('');
  document.querySelectorAll('[data-rec-asset]').forEach(b => b.onclick = () => { const a=state.assets.find(x=>x.id===b.dataset.recAsset); if(a) a.status='مستلمة'; renderAll(); });
}

function renderOperations() {
  $('operationsTable').innerHTML = state.operations.map(o => `<tr><td>${nameOf(o.employeeId)}</td><td>${o.title}</td><td>${money(o.amount)}</td><td>${o.status}</td><td><button data-appr-op="${o.id}">اعتماد</button></td></tr>`).join('');
  document.querySelectorAll('[data-appr-op]').forEach(b => b.onclick = () => { const o=state.operations.find(x=>x.id===b.dataset.apprOp); if(o) o.status='معتمدة'; renderAll(); });
}

function renderPayroll() {
  const m = $('payrollMonth').value || new Date().toISOString().slice(0,7);
  $('payrollTable').innerHTML = state.employees.map(e => {
    const rec = state.attendance.filter(a => a.employeeId===e.id && monthKey(a.date)===m);
    const p=rec.filter(r=>r.status==='حاضر').length; const a=rec.filter(r=>r.status==='غائب').length;
    const salary=Math.max(0,e.salary-(e.salary/30)*a);
    return `<tr><td>${e.name}</td><td>${p}</td><td>${a}</td><td>${money(salary)}</td></tr>`;
  }).join('');
}

function renderSession() {
  const user = currentUser();
  $('sessionText').textContent = user ? `مرحبًا ${user.name} (${user.role})` : 'نظام متكامل لإدارة الموظفين';
  $('authView').classList.toggle('hidden', !!user);
  $('appView').classList.toggle('hidden', !user);
}

function renderAll() { save(); renderSession(); if(!currentUser()) return; refreshEmployeeSelectors(); renderEmployees(); renderAccounts(); renderTasks(); renderAssets(); renderOperations(); renderPayroll(); renderDashboard(); }

function initEvents() {
  $('loginBtn').onclick = () => {
    const email=$('loginEmail').value.trim().toLowerCase(); const password=$('loginPassword').value;
    const user = state.users.find(u => u.email.toLowerCase()===email && u.password===password);
    if(!user) return alert('بيانات الدخول غير صحيحة');
    state.session = user.id; renderAll();
  };
  $('logoutBtn').onclick = () => { state.session = null; renderAll(); };

  document.querySelectorAll('.tab').forEach(btn => btn.onclick = () => {
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active')); $(btn.dataset.tab).classList.add('active');
  });

  $('employeeForm').onsubmit = e => { e.preventDefault(); state.employees.push({id:crypto.randomUUID(),name:$('empName').value.trim(),role:$('empRole').value.trim(),department:$('empDepartment').value.trim(),salary:Number($('empSalary').value)}); e.target.reset(); renderAll(); };
  $('accountForm').onsubmit = e => { e.preventDefault(); if(currentUser()?.role!=='manager') return; state.users.push({id:crypto.randomUUID(),name:$('accName').value.trim(),email:$('accEmail').value.trim(),password:$('accPassword').value,role:$('accRole').value}); e.target.reset(); renderAll(); };

  $('saveAttendance').onclick = () => { const employeeId=$('attEmp').value; const date=$('attDate').value; const status=$('attStatus').value; if(!employeeId||!date) return alert('أكمل البيانات'); const ex=state.attendance.find(a=>a.employeeId===employeeId&&a.date===date); ex?ex.status=status:state.attendance.push({employeeId,date,status}); renderAll(); };
  $('addTask').onclick = () => { if(!$('taskEmp').value||!$('taskTitle').value.trim()) return alert('أكمل البيانات'); state.tasks.push({id:crypto.randomUUID(),employeeId:$('taskEmp').value,title:$('taskTitle').value.trim(),dueDate:$('taskDue').value,status:'مفتوحة'}); renderAll(); };
  $('addAsset').onclick = () => { if(!$('assetEmp').value||!$('assetName').value.trim()) return alert('أكمل البيانات'); state.assets.push({id:crypto.randomUUID(),employeeId:$('assetEmp').value,name:$('assetName').value.trim(),date:$('assetDate').value,status:'بعهدة الموظف'}); renderAll(); };
  $('addOperation').onclick = () => { if(!$('opEmp').value||!$('opTitle').value.trim()) return alert('أكمل البيانات'); state.operations.push({id:crypto.randomUUID(),employeeId:$('opEmp').value,title:$('opTitle').value.trim(),amount:Number($('opAmount').value||0),status:'قيد المراجعة'}); renderAll(); };

  $('payrollMonth').onchange = renderAll;
  $('exportBtn').onclick = () => { const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})); a.download='finovate-hr-data.json'; a.click(); };
  $('importFile').onchange = async e => { const f=e.target.files?.[0]; if(!f) return; try{const d=JSON.parse(await f.text()); Object.assign(state,d); renderAll();}catch{alert('ملف غير صالح')} e.target.value=''; };
}

ensureAdmin();
$('payrollMonth').value = new Date().toISOString().slice(0,7);
initEvents();
renderAll();
