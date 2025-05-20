let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(tasks);

const dashboardSection = document.getElementById("dashboardSection");
const usernameDisplay = document.getElementById("usernameDisplay");
const addTaskBtn = document.getElementById("addTaskBtn");
const viewTasksBtn = document.getElementById("viewTasksBtn");
const dashboardBtn = document.getElementById("dashboardBtn");
const taskForm = document.getElementById("taskForm");
const welcomeBox = document.getElementById("welcomeBox");
const taskList = document.getElementById("taskList");
const tasksContainer = document.getElementById("tasksContainer");
const taskSubmissionForm = document.getElementById("taskSubmissionForm");
const taskTitle = document.getElementById("taskTitle");
const taskStatus = document.getElementById("taskStatus");
const taskDate = document.getElementById("taskDate");
const taskDescription = document.getElementById("taskDescription");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const tempHeaderTask = document.getElementById("tempHeaderTask");
const dataPickerField = document.getElementById("dataPickerField");

let isEditing = false;
let editingIndex = -1;

document.addEventListener("DOMContentLoaded", function () {
  showDashboard();

  setInterval(function () {
    const undoneCount = countUndoneTasks();
    if (undoneCount > 0) {
      sendNotification(`شما ${undoneCount} کار انجام نشده دارید.`);
    }
  }, 3 * 60 * 60 * 1000);
});

function showDashboard() {
  dashboardSection.style.display = "block";
  usernameDisplay.textContent = `${localStorage.getItem(
    "zistFirstName"
  )} ${localStorage.getItem("zistLastName")}`;

  const completed = tasks.filter((task) => task.status === "انجام شده").length;
  const unCompleted = tasks.length - completed;
  const progressPercentage =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("unCompletedTasks").textContent = unCompleted;
  document.querySelector(
    ".progress-fill"
  ).style.width = `${progressPercentage}%`;
  document.querySelector(
    ".progress-text"
  ).textContent = `پیشرفت کلی: ${progressPercentage}%`;

  refreshTaskList();

  // Request notification permission
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

addTaskBtn.addEventListener("click", () => {
  welcomeBox.style.display = "none";
  taskForm.style.display = "block";
  taskList.style.display = "none";
  taskSubmissionForm.reset();

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
  isEditing = false;
  editingIndex = -1;
  document.querySelector(
    '#taskSubmissionForm button[type="submit"]'
  ).textContent = " اضافه کردن ";
  cancelEditBtn.style.display = "none";
  tempHeaderTask.textContent = "افزودن کار جدید";
});

viewTasksBtn.addEventListener("click", () => {
  welcomeBox.style.display = "none";
  taskForm.style.display = "none";
  taskList.style.display = "block";
  refreshTaskList();
});

dashboardBtn.addEventListener("click", () => {
  welcomeBox.style.display = "block";
  taskForm.style.display = "none";
  taskList.style.display = "none";

  const completed = tasks.filter((task) => task.status === "انجام شده").length;
  const unCompleted = tasks.length - completed;
  const progressPercentage =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  // Update DOM elements
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("unCompletedTasks").textContent = unCompleted;
  document.querySelector(
    ".progress-fill"
  ).style.width = `${progressPercentage}%`;
  document.querySelector(
    ".progress-text"
  ).textContent = `پیشرفت کلی: ${progressPercentage}%`;

  // refreshTaskList();
});

function refreshTaskList() {
  tasksContainer.innerHTML = "";

  if (tasks.length === 0) {
    tasksContainer.innerHTML = `
 <div class="no-tasks">
 🗑️ هیچ کاری ثبت نشده است
 </div>
 `;
    return;
  }

  tasks.forEach((task, index) => {
    const taskElement = `
 <div class="task-item">
 <div class="task-header">
 <div class="priority-badge priority-${task.status.replace(" ", "-")}">
 وضعیت: ${task.status}
 </div>
 <div class="task-date">   ${task.date}
 </div>
 </div>
 <div class="task-body">
 <h3>${task.title}</h3>
 <div class="task-description">${task.description || "بدون توضیحات"}</div>
 </div>
 <div class="task-actions">
 <div class="edit-icon" onclick="editTask(${index})">
 <svg viewBox="0 0 24 24">
 <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
 </svg>
 </div>
 <div class="trash-icon" onclick="deleteTask(${index})">
 <svg viewBox="0 0 24 24">
 <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
 </svg>
 </div>
 </div>
 </div>
 `;
    tasksContainer.innerHTML += taskElement;
  });
}

function deleteTask(index) {
  if (confirm("آیا از حذف این کار مطمئنید؟")) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    refreshTaskList();
  }
}

function editTask(index) {
  isEditing = true;
  editingIndex = index;
  const task = tasks[index];
  taskTitle.value = task.title;
  taskStatus.value = task.status;

  // taskDate.value = task.date;
  dataPickerField.value = task.date;

  taskDescription.value = task.description || "";
  welcomeBox.style.display = "none";
  taskForm.style.display = "block";
  taskList.style.display = "none";
  document.querySelector(
    '#taskSubmissionForm button[type="submit"]'
  ).textContent = " اعمال تغییرات";
  cancelEditBtn.style.display = "block";

  tempHeaderTask.textContent = "ویرایش";
}

taskSubmissionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (isEditing) {
    tasks[editingIndex] = {
      title: taskTitle.value,
      status: taskStatus.value,
      date: dataPickerField.value,
      description: taskDescription.value,
      createdAt: tasks[editingIndex].createdAt,
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("تغییرات اعمال شود!");
    isEditing = false;
    editingIndex = -1;
    document.querySelector(
      '#taskSubmissionForm button[type="submit"]'
    ).textContent = " اضافه کردن کار";
    cancelEditBtn.style.display = "none";
    taskForm.style.display = "none";
    taskList.style.display = "block";

    tempHeaderTask.textContent = "افزودن کار جدید";

    refreshTaskList();
  } else {
    const newTask = {
      title: taskTitle.value,
      status: taskStatus.value,
      date: dataPickerField.value,
      description: taskDescription.value,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    this.reset();
    alert("کار با موفقیت اضافه شد!");
    taskForm.style.display = "none";
    taskList.style.display = "block";
    refreshTaskList();
  }
});

cancelEditBtn.addEventListener("click", function () {
  isEditing = false;
  editingIndex = -1;
  taskSubmissionForm.reset();
  document.querySelector(
    '#taskSubmissionForm button[type="submit"]'
  ).textContent = "➕ اضافه کردن";
  this.style.display = "none";
  taskForm.style.display = "none";
  taskList.style.display = "block";
  refreshTaskList();
});

// dataPickerField.addEventListener("click", function () {
//   console.log(this.value);
// });

const exportExcelBtn = document.getElementById("exportExcelBtn");
exportExcelBtn.addEventListener("click", exportTasksToExcel);

function exportTasksToExcel() {
  if (tasks.length === 0) {
    alert("هیچ کار‌ای برای خروجی اکسل موجود نیست!");
    return;
  }
  const xlsData = tasks.map((task) => {
    return {
      "عنوان کار": task.title,
      وضعیت: task.status,
      "تاریخ انجام": new Date(task.date).toLocaleDateString("fa-IR"),
      توضیحات: task.description || "ندارد",
      "تاریخ ثبت": new Date(task.createdAt).toLocaleString("fa-IR"),
    };
  });
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(xlsData);
  XLSX.utils.book_append_sheet(wb, ws, "وظایف");
  XLSX.writeFile(wb, "tasks.xlsx");
}

function countUndoneTasks() {
  return tasks.filter((task) => task.status !== "انجام شده").length;
}

function sendNotification(message) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification("یادآوری وظایف", { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("یادآوری وظایف", { body: message });
        }
      });
    }
  } else {
    console.log("This browser does not support desktop notifications");
  }
}
