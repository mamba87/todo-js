var taskNameInput = document.getElementById("taskNameInput"),
    taskList = document.getElementById("taskList"),
    submitButton = document.getElementById("submitButton");

submitButton.addEventListener('click', function () {
    createTask();
});

taskNameInput.addEventListener('keypress', function () {
    var keyCode = event.keyCode;

    if (keyCode === 13) {
        createTask();
    }
});

function createTask() {
    var taskName = taskNameInput.value;

    if (validateName(taskName)) {
        createTaskRowAndAddToHtml(taskName);
    } else {
        alert("Enter a task name (min. length 3 chars)");
    }

    taskNameInput.value = ''
}

function createTaskRowAndAddToHtml(taskName) {
    var liElement = document.createElement('li'),
        liTextElement = document.createTextNode(taskName),
        buttonElement = document.createElement('button'),
        buttonTextElement = document.createTextNode('Done');

    liElement.appendChild(liTextElement);
    buttonElement.appendChild(buttonTextElement);
    liElement.appendChild(buttonElement);
    taskList.appendChild(liElement);
    buttonElement.addEventListener('click', toggleTaskStatus);
}

function toggleTaskStatus() {
    var task = this.parentElement,
        currentStatus = task.className,
        buttonText = this.innerText;

    if (currentStatus === 'done') {
        task.className = '';
        this.innerText = 'Done';
    } else {
        task.className = 'done';
        this.innerText = 'Uncheck';
    }
}

function validateName(taskName) {
    if (taskName.length >= 3) {
        return true;
    } else {
        return false;
    }
}
