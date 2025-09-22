let tasks = [];
let selectedTaskIndex = null;

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const modal = new bootstrap.Modal(document.getElementById("taskModal"));
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const editTaskBtn = document.getElementById("editTaskBtn");
const deleteTaskBtn = document.getElementById("deleteTaskBtn");

// Adicionar tarefa
taskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const desc = document.getElementById("taskDesc").value;

  tasks.push({ title, desc });
  renderTasks();
  taskForm.reset();
});

// Renderizar lista
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card shadow-sm p-3 task-item" data-index="${index}" style="cursor:pointer;">
        <h5>${task.title}</h5>
        <p class="text-muted text-truncate">${task.desc}</p>
      </div>
    `;
    taskList.appendChild(col);

    col.querySelector(".task-item").addEventListener("click", () => openTaskModal(index));
  });
}

// Abrir modal
function openTaskModal(index) {
  selectedTaskIndex = index;
  modalTitle.textContent = tasks[index].title;
  modalDesc.textContent = tasks[index].desc;
  modal.show();
}

// Editar tarefa
editTaskBtn.addEventListener("click", () => {
  const newTitle = prompt("Novo título:", tasks[selectedTaskIndex].title);
  const newDesc = prompt("Nova descrição:", tasks[selectedTaskIndex].desc);
  if (newTitle) tasks[selectedTaskIndex].title = newTitle;
  if (newDesc) tasks[selectedTaskIndex].desc = newDesc;
  renderTasks();
  modal.hide();
});

// Excluir tarefa
deleteTaskBtn.addEventListener("click", () => {
  if (confirm("Deseja excluir esta tarefa?")) {
    tasks.splice(selectedTaskIndex, 1);
    renderTasks();
    modal.hide();
  }
});
