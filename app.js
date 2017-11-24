// get reference
const submitButton = document.getElementById('submitButton');
const inputTask = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const cleanLocalStorageButton = document.getElementById('cleanLocalStorage');

let tasks = [];
let idCounter = 0;

showTasks();
checkAirQualityAndColourBackground();

submitButton.addEventListener('click', function(e) {
  e.preventDefault();
  let value = inputTask.value;
  if (validate(value)) {
    addTask(value);
    saveToLocalStorage();
  }
  inputTask.value = '';
});

function addTask(value) {
  let task = {
    id: idCounter++,
    value: value,
    status: 'new',
  };
  tasks.push(task);

  createTaskHTML(task.id, task.value, task.status);
}

function removeTask(element) {
  let row = element.parentElement;
  let id = row.id.substring(2);
  tasks = tasks.filter(function(task) {
    return task.id !== +id;
  });
}

function changeStatus() {
  let row = this.parentElement;
  let oldStatus = row.classList[0];
  let status = oldStatus === 'new' ? 'done' : 'new';

  row.classList.remove(oldStatus);
  row.classList.add(status);
  let id = row.id.substring(2);
  for (let i = 0, max = tasks.length; i < max; i++) {
    if (tasks[i].id === +id) {
      tasks[i].status = status;
    }
  }
  saveToLocalStorage();
}

function showTasks() {
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  while (taskList.hasChildNodes()) {
    taskList.removeChild(taskList.lastChild);
  }
  for (let i = 0, max = tasks.length; i < max; i++) {
    createTaskHTML(tasks[i].id, tasks[i].value, tasks[i].status);
  }
}

function createTaskHTML(id, value, status) {
  let row = document.createElement('li');
  let rowText = document.createTextNode(value);
  row.classList.add(status);
  row.id = 'id' + id;
  row.appendChild(rowText);

  let buttonDone = document.createElement('button');
  let buttonDoneText = document.createTextNode('done');
  buttonDone.addEventListener('click', changeStatus);
  buttonDone.appendChild(buttonDoneText);

  let buttonRemove = document.createElement('button');
  let buttonRemoveText = document.createTextNode('delete');
  buttonRemove.addEventListener('click', function(e) {
    e.preventDefault();
    removeTask(this);
    saveToLocalStorage();
    showTasks();
  });
  buttonRemove.appendChild(buttonRemoveText);

  row.appendChild(buttonDone);
  row.appendChild(buttonRemove);

  taskList.appendChild(row);
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function validate(value) {
  if (value === '') {
    alert('Enter the task name');
    return false;
  }
  return true;
}

function checkAirQualityAndColourBackground() {
  let proxyURL = 'https://cors-anywhere.herokuapp.com';

  let krakowDietlaAirQualityUrl = 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/10121';
  let url = proxyURL + '/' + krakowDietlaAirQualityUrl;

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      let indexLevelName = json.pm10IndexLevel.indexLevelName;
      colourBackground(indexLevelName);
    })
    .catch(function(err) {
      console.log('something went wrong: ', +err);
    });
}

function colourBackground(indexLevelName) {
  switch (indexLevelName) {
    case 'Bardzo dobry':
      document.body.style.backgroundColor = 'green';
      break;
    case 'Dobry':
      document.body.style.backgroundColor = 'lightgreen';
      break;
    case 'Umiarkowany':
      document.body.style.backgroundColor = 'yellow';
      break;
    case 'Dostateczny':
      document.body.style.backgroundColor = 'orange';
      break;
    case 'Zły':
      document.body.style.backgroundColor = 'red';
      break;
    case 'Bardzo zły':
      document.body.style.backgroundColor = 'purple';
      break;
    default:
      document.body.style.backgroundColor = 'white';
  }
}

cleanLocalStorageButton.addEventListener('click', function(e) {
  e.preventDefault();
  tasks.length = 0;
  localStorage.removeItem('tasks');
  showTasks();
});
