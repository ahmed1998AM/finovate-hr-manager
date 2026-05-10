const STORAGE_KEY = "hr_manager_data_v2";

const emptyState = { employees: [], attendance: [], leaves: [] };
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(emptyState));

const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatMoney(v) {
  return new Intl.NumberFormat("ar", { maximumFractionDigits: 2 }).format(v);
}

function monthKey(dateStr) {
  return dateStr?.slice(0, 7);
}

function selectedMonth() {
  return $("payrollMonth").value || new Date().toISOString().slice(0, 7);
}

function setDefaultMonth() {
  $("payrollMonth").value = new Date().toISOString().slice(0, 7);
}

function employeeName(id) {
  return state.employees.find(e => e.id === id)?.name || "-";
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

function renderEmployees() {
  const tbody = $("employeesTable");
  tbody.innerHTML = "";
  const q = $("searchEmployee").value.trim().toLowerCase();

  for (const emp of state.employees) {
    const line = `${emp.name} ${emp.role} ${emp.department}`.toLowerCase();
    if (q && !line.includes(q)) continue;

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${emp.name}</td><td>${emp.role}</td><td>${emp.department}</td><td>${formatMoney(emp.salary)}</td>
      <td><button class="danger" data-id="${emp.id}">حذف</button></td>`;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      state.employees = state.employees.filter(e => e.id !== id);
      state.attendance = state.attendance.filter(a => a.employeeId !== id);
      state.leaves = state.leaves.filter(l => l.employeeId !== id);
      renderAll();
    };
  });
}

function renderLeaves() {
  const tbody = $("leavesTable");
  tbody.innerHTML = "";

  for (const leave of state.leaves) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${employeeName(leave.employeeId)}</td><td>${leave.from}</td><td>${leave.to}</td><td>${leave.status}</td>`;
    tbody.appendChild(tr);
  }
}

function renderPayroll() {
  const tbody = $("payrollTable");
  tbody.innerHTML = "";
  const m = selectedMonth();

  for (const emp of state.employees) {
    const entries = state.attendance.filter(a => a.employeeId === emp.id && monthKey(a.date) === m);
    const present = entries.filter(a => a.status === "حاضر").length;
    const absent = entries.filter(a => a.status === "غائب").length;
    const leaveDays = entries.filter(a => a.status === "إجازة").length;
    const finalSalary = Math.max(0, emp.salary - (emp.salary / 30) * absent);

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${emp.name}</td><td>${present}</td><td>${absent}</td><td>${leaveDays}</td><td>${formatMoney(finalSalary)}</td>`;
    tbody.appendChild(tr);
  }
}

function renderAll() {
  refreshSelectors();
  renderEmployees();
  renderLeaves();
  renderPayroll();
  save();
}

$("employeeForm").addEventListener("submit", event => {
  event.preventDefault();
  const emp = {
    id: crypto.randomUUID(),
    name: $("name").value.trim(),
    role: $("role").value.trim(),
    department: $("department").value.trim(),
    salary: Number($("salary").value)
  };

  if (!emp.name || !emp.role || !emp.department || !(emp.salary > 0)) {
    alert("تحقق من جميع الحقول.");
    return;
  }

  state.employees.push(emp);
  $("employeeForm").reset();
  renderAll();
});

$("addAttendance").onclick = () => {
  if (!$("attendanceEmployee").value) return alert("أضف موظفًا أولًا");
  const date = $("attendanceDate").value;
  const status = $("attendanceStatus").value;
  if (!date) return alert("اختر تاريخًا");

  state.attendance.push({ employeeId: $("attendanceEmployee").value, date, status });
  renderAll();
};

$("addLeave").onclick = () => {
  if (!$("leaveEmployee").value) return alert("أضف موظفًا أولًا");
  const from = $("leaveFrom").value;
  const to = $("leaveTo").value;
  if (!from || !to || from > to) return alert("حدد فترة إجازة صحيحة");

  state.leaves.push({ employeeId: $("leaveEmployee").value, from, to, status: "قيد المراجعة" });
  renderAll();
};

$("searchEmployee").addEventListener("input", renderEmployees);
$("payrollMonth").addEventListener("change", renderPayroll);

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
  renderAll();
};

setDefaultMonth();
renderAll();
