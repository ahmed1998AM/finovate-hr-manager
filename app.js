const STORAGE_KEY = 'finovate_hr_suite_v1';
const defaultAdmin = { id: crypto.randomUUID(), name: 'System Admin', email: 'admin@finovate.local', password: 'admin123', role: 'manager' };
const initial = { users: [defaultAdmin], employees: [], attendance: [], tasks: [], assets: [], operations: [], session: null };
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(initial));

const STORAGE_KEY = "hr_manager_data_v3";

const emptyState = { employees: [], attendance: [], leaves: [] };
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(emptyState));
let editingEmployeeId = null;

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

function resetEmployeeForm() {
  editingEmployeeId = null;
  $("employeeSubmit").textContent = "حفظ الموظف";
  $("employeeForm").reset();
}

function refreshSelectors() {
  [$("attendanceEmployee"), $("leaveEmployee")].forEach(sel => {
    sel.innerHTML = "";
    for (const e of state.employees) {
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.name} - ${e.department}`;
      sel.appendChild(opt);
    }
  });
}

function renderStats() {
  const m = selectedMonth();
  const monthAttendance = state.attendance.filter(a => monthKey(a.date) === m);
  const departments = new Set(state.employees.map(e => e.department));
  $("totalEmployees").textContent = String(state.employees.length);
  $("totalDepartments").textContent = String(departments.size);
  $("monthAbsences").textContent = String(monthAttendance.filter(a => a.status === "غائب").length);
  $("monthLeaves").textContent = String(state.leaves.length);
}

function renderEmployees() {
  const tbody = $("employeesTable");
  tbody.innerHTML = "";
  const q = $("searchEmployee").value.trim().toLowerCase();

  for (const emp of state.employees) {
    const line = `${emp.name} ${emp.role} ${emp.department}`.toLowerCase();
    if (q && !line.includes(q)) continue;

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${emp.name}</td><td>${emp.role}</td><td>${emp.department}</td><td>${formatMoney(emp.salary)}</td>
      <td class="row-actions">
        <button class="muted" data-edit-id="${emp.id}">تعديل</button>
        <button class="danger" data-delete-id="${emp.id}">حذف</button>
      </td>`;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-delete-id]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.deleteId;
      state.employees = state.employees.filter(e => e.id !== id);
      state.attendance = state.attendance.filter(a => a.employeeId !== id);
      state.leaves = state.leaves.filter(l => l.employeeId !== id);
      if (editingEmployeeId === id) resetEmployeeForm();
      renderAll();
    };
  });

  tbody.querySelectorAll("button[data-edit-id]").forEach(btn => {
    btn.onclick = () => {
      const emp = state.employees.find(e => e.id === btn.dataset.editId);
      if (!emp) return;
      editingEmployeeId = emp.id;
      $("name").value = emp.name;
      $("role").value = emp.role;
      $("department").value = emp.department;
      $("salary").value = emp.salary;
      $("employeeSubmit").textContent = "تحديث الموظف";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  });
}

function renderLeaves() {
  const tbody = $("leavesTable");
  tbody.innerHTML = "";

  for (const leave of state.leaves) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${employeeName(leave.employeeId)}</td><td>${leave.from}</td><td>${leave.to}</td><td>${leave.status}</td>
      <td><button class="success" data-approve-id="${leave.id}">اعتماد</button></td>`;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-approve-id]").forEach(btn => {
    btn.onclick = () => {
      const item = state.leaves.find(l => l.id === btn.dataset.approveId);
      if (!item) return;
      item.status = "معتمدة";
      renderAll();
    };
  });

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

function renderAll() {
  refreshSelectors();
  renderEmployees();
  renderLeaves();
  renderPayroll();
  renderStats();
  save();
}

$("employeeForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = {
    name: $("name").value.trim(),
    role: $("role").value.trim(),
    department: $("department").value.trim(),
    salary: Number($("salary").value)

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

  if (!data.name || !data.role || !data.department || !(data.salary > 0)) {
    alert("تحقق من جميع الحقول.");
    return;
  }

  if (editingEmployeeId) {
    const existing = state.employees.find(e => e.id === editingEmployeeId);
    if (existing) Object.assign(existing, data);
  } else {
    state.employees.push({ id: crypto.randomUUID(), ...data });
  }

  resetEmployeeForm();
  renderAll();
});

$("addAttendance").onclick = () => {
  if (!$("attendanceEmployee").value) return alert("أضف موظفًا أولًا");
  const date = $("attendanceDate").value;
  const status = $("attendanceStatus").value;
  if (!date) return alert("اختر تاريخًا");

  const employeeId = $("attendanceEmployee").value;
  const existing = state.attendance.find(a => a.employeeId === employeeId && a.date === date);
  if (existing) {
    existing.status = status;
  } else {
    state.attendance.push({ employeeId, date, status });
  }
  renderAll();
};

$("addLeave").onclick = () => {
  if (!$("leaveEmployee").value) return alert("أضف موظفًا أولًا");
  const from = $("leaveFrom").value;
  const to = $("leaveTo").value;
  if (!from || !to || from > to) return alert("حدد فترة إجازة صحيحة");

  state.leaves.push({ id: crypto.randomUUID(), employeeId: $("leaveEmployee").value, from, to, status: "قيد المراجعة" });
  renderAll();
};

$("searchEmployee").addEventListener("input", renderEmployees);
$("payrollMonth").addEventListener("change", () => {
  renderPayroll();
  renderStats();
});

$("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hr-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

$("importFile").addEventListener("change", async event => {
  const [file] = event.target.files || [];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data.employees) || !Array.isArray(data.attendance) || !Array.isArray(data.leaves)) {
      throw new Error("invalid shape");
    }
    state.employees = data.employees;
    state.attendance = data.attendance;
    state.leaves = data.leaves;
    resetEmployeeForm();
    renderAll();
  } catch {
    alert("ملف غير صالح");
  }
  event.target.value = "";
});

$("resetBtn").onclick = () => {
  if (!confirm("هل تريد مسح كل البيانات؟")) return;
  state.employees = [];
  state.attendance = [];
  state.leaves = [];
  resetEmployeeForm();
  renderAll();
};

setDefaultMonth();
renderAll();
