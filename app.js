// get reference
const submitButton = document.getElementById('submitButton');
const inputTask = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const cleanLocalStorage = document.getElementById('cleanLocalStorage');

let tasks = [];

showTasks();
checkAirQualityAndColourBackground();

submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    let value = inputTask.value;
    if (validate(value)) {
        addTask(value);
    }
});

function addTask(value) {
    let task = {
        id: tasks.length,
        value: value,
        status: 'new'
    };
    tasks.push(task);
    saveToLocalStorage();

    let node = createTaskHTML(task.id, task.value, task.status);
    taskList.appendChild(node);
}

function removeTask() {
    let row = this.parentElement;
    let id = row.id.substring(2);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id, 10)) {
            tasks.splice(i, 1);
        }
    }
    saveToLocalStorage();
    showTasks();
}

function changeStatus() {
    let row = this.parentElement;
    let oldStatus = row.classList[0];
    let status = 'new';

    if (oldStatus === 'new'){
        status = 'done'
    }else{
        status = 'new'
    }

    row.classList.remove(oldStatus);
    row.classList.add(status);
    let id = row.id.substring(2);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id, 10)) {
            tasks[i].status = status;
        }
    }
    saveToLocalStorage();
}

function showTasks() {
    if (localStorage.getItem('tasks') !== null && localStorage.getItem('tasks') !== '') {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    while (taskList.hasChildNodes()) {
        taskList.removeChild(taskList.lastChild);
    }
    for (let i = 0; i < tasks.length; i++) {
        let node = createTaskHTML(tasks[i].id, tasks[i].value, tasks[i].status);
        taskList.appendChild(node);
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
    buttonRemove.addEventListener('click', removeTask);
    buttonRemove.appendChild(buttonRemoveText);

    row.appendChild(buttonDone);
    row.appendChild(buttonRemove);

    return row;
}

function saveToLocalStorage(){
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
    var proxyURL = 'https://cors-anywhere.herokuapp.com';
    
    var krakowDietlaAirQualityUrl = "http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/10121";
    var url = proxyURL + "/" + krakowDietlaAirQualityUrl;

    fetch(url)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            let indexLevelName = json.pm10IndexLevel.indexLevelName;
            colourBackground(indexLevelName);
        }).catch(function(err) {
            console.log("something went wrong", + err);
        });
}

function colourBackground(indexLevelName) {
    if(indexLevelName === "Bardzo dobry"){
        document.body.style.backgroundColor = "green";
    } else if(indexLevelName === "Dobry"){
        document.body.style.backgroundColor = "green";
    } else if(indexLevelName === "Umiarkowany"){
        document.body.style.backgroundColor = "yellow";
    } else if(indexLevelName=== "Dostateczny"){
        document.body.style.backgroundColor = "orange";
    } else if(indexLevelName === "Zły"){
        document.body.style.backgroundColor = "red";
    } else if(indexLevelName === "Bardzo zły"){
        document.body.style.backgroundColor = "red";
    } else if(indexLevelName === "Brak indeksu"){
        document.body.style.backgroundColor = "white";
    }
}

cleanLocalStorage.addEventListener('click', function () {
    tasks = [];
    localStorage.setItem('tasks', []);
    showTasks();
});