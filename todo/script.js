let tasks = [];

function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (text === '') return;

  tasks.push({ text, done: false });
  input.value = '';
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleDone(index);

    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = 'task-text';
    if (task.done) span.classList.add('done');

    left.appendChild(checkbox);
    left.appendChild(span);

    const buttons = document.createElement('div');
    buttons.className = 'task-buttons';

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Edit';
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑️';
    delBtn.title = 'Delete';
    delBtn.onclick = () => deleteTask(index);

    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(buttons);
    list.appendChild(li);
  });

  updateProgressCircle();
}

function updateProgressCircle() {
  const circle = document.querySelector('.progress-ring .progress');
  const valueText = document.getElementById('progress-value');

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  circle.style.strokeDashoffset = offset;
  valueText.textContent = percent + '%';

  if (percent === 100) {
    showFireworks();
  }
}

function showFireworks() {
  const container = document.getElementById('fireworks');
  container.innerHTML = '';

  const colors = ['#10b981', '#059669', '#34d399', '#047857', '#6ee7b7'];

  for (let i = 0; i < 25; i++) {
    const spark = document.createElement('div');
    spark.className = 'firework';

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 120 + 50;
    const x = `${Math.cos(angle) * distance}px`;
    const y = `${Math.sin(angle) * distance}px`;

    spark.style.setProperty('--x', x);
    spark.style.setProperty('--y', y);
    spark.style.left = '50%';
    spark.style.top = '40%';
    spark.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(spark);
  }

  setTimeout(() => {
    container.innerHTML = '';
  }, 1500);
}

// Initial call
updateProgressCircle();
