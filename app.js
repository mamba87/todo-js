var taskInput = document.getElementById("taskInput");
var taskList = document.getElementById("taskList");
var submitButton = document.getElementById("submitButton");


submitButton.addEventListener('click', function () {
    var taskName = taskInput.value;
    if (valid(taskName)) {
        createTaskRowAndAddToHtml(taskName);
    } else {
        alert("Enter a task name");
    }
    taskInput.value = ''
});

function createTaskRowAndAddToHtml(taskName) {
    var liElement = document.createElement('li');
    var textElement = document.createTextNode(taskName);
    liElement.appendChild(textElement);

    var buttonElement = document.createElement('button');
    var buttonTextElement = document.createTextNode('Done');
    buttonElement.addEventListener('click', taskDone);
    buttonElement.appendChild(buttonTextElement);

    liElement.appendChild(buttonElement);

    taskList.appendChild(liElement);
}

function taskDone() {
    var task = this.parentElement;
    var currentStatus = task.className;
    if (currentStatus === 'done') {
        task.className = '';
    } else {
        task.className = 'done';
    }
}

function valid(taskName) {
    if (taskName === '') {
        return false;
    } else {
        return true;
    }
}