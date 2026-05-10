const STORAGE_KEY = "hr_manager_data_v1";

const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"employees":[],"attendance":[],"leaves":[]}');

const employeeForm = document.getElementById("employeeForm");
const employeesTable = document.getElementById("employeesTable");
const payrollTable = document.getElementById("payrollTable");
const attendanceEmployee = document.getElementById("attendanceEmployee");
const leaveEmployee = document.getElementById("leaveEmployee");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function employeeName(id) {
  return state.employees.find(e => e.id === id)?.name || "-";
}

function refreshSelectors() {
  [attendanceEmployee, leaveEmployee].forEach(sel => {
    sel.innerHTML = "";
    state.employees.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.name} - ${e.department}`;
      sel.appendChild(opt);
    });
  });
}

function renderEmployees() {
  employeesTable.innerHTML = "";
  state.employees.forEach(emp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${emp.name}</td><td>${emp.role}</td><td>${emp.department}</td><td>${emp.salary}</td>
      <td><button data-id="${emp.id}" class="delete">حذف</button></td>`;
    employeesTable.appendChild(tr);
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      state.employees = state.employees.filter(e => e.id !== id);
      state.attendance = state.attendance.filter(a => a.employeeId !== id);
      state.leaves = state.leaves.filter(l => l.employeeId !== id);
      save();
      renderAll();
    };
  });
}

function renderPayroll() {
  payrollTable.innerHTML = "";
  state.employees.forEach(emp => {
    const monthEntries = state.attendance.filter(a => a.employeeId === emp.id);
    const present = monthEntries.filter(a => a.status === "حاضر").length;
    const absent = monthEntries.filter(a => a.status === "غائب").length;
    const dailyRate = Number(emp.salary) / 30;
    const finalSalary = Math.max(0, Number(emp.salary) - absent * dailyRate).toFixed(2);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${emp.name}</td><td>${present}</td><td>${absent}</td><td>${finalSalary}</td>`;
    payrollTable.appendChild(tr);
  });
}

function renderAll() {
  refreshSelectors();
  renderEmployees();
  renderPayroll();
  save();
}

employeeForm.addEventListener("submit", e => {
  e.preventDefault();
  const emp = {
    id: crypto.randomUUID(),
    name: document.getElementById("name").value.trim(),
    role: document.getElementById("role").value.trim(),
    department: document.getElementById("department").value.trim(),
    salary: Number(document.getElementById("salary").value)
  };
  if (!emp.name || !emp.role || !emp.department || !emp.salary) return;
  state.employees.push(emp);
  employeeForm.reset();
  renderAll();
});

document.getElementById("addAttendance").onclick = () => {
  if (!attendanceEmployee.value) return alert("أضف موظفًا أولًا");
  const date = document.getElementById("attendanceDate").value;
  const status = document.getElementById("attendanceStatus").value;
  if (!date) return alert("اختر تاريخًا");
  state.attendance.push({ employeeId: attendanceEmployee.value, date, status });
  renderAll();
};

document.getElementById("addLeave").onclick = () => {
  if (!leaveEmployee.value) return alert("أضف موظفًا أولًا");
  const from = document.getElementById("leaveFrom").value;
  const to = document.getElementById("leaveTo").value;
  if (!from || !to) return alert("حدد فترة الإجازة");
  state.leaves.push({ employeeId: leaveEmployee.value, from, to, status: "Pending" });
  alert(`تم إرسال طلب إجازة لـ ${employeeName(leaveEmployee.value)}`);
  renderAll();
};

document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hr-data.json";
  a.click();
  URL.revokeObjectURL(url);
};

renderAll();
