const myButton = document.getElementById('add_button');
const newTask = document.getElementById('new_task');
const newTaskDescription = document.getElementById('task_description');
const newTaskDeadline = document.getElementById('task_deadline');

/*
let show_task_name = document.getElementById('show_task_name');
let show_task_description = document.getElementById('show_task_description');
let show_task_deadline = document.getElementById('show_task_deadline');
*/

let request = window.indexedDB.open('MyTestDatabase1', 1);

request.onerror = (event) => {
    console.log('Error opening database');
}

request.onsuccess = (event) => {
    console.log('Database opened successfully');
}

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log('Database upgrade needed');

    const store = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

    store.createIndex('task_name', 'task_name', { unique: false });
    store.createIndex('task_description', 'task_description', { unique: false });
    store.createIndex('task_deadline', 'task_deadline', { unique: false });

    console.log('Database setup complete');
}

// click event
myButton.addEventListener('click', function() {
    setTimeout(() => {
        request = window.indexedDB.open('MyTestDatabase1', 1);
    }, 10);

    let db = request.result;
    let transaction = db.transaction(['tasks'], 'readwrite');
    let store = transaction.objectStore('tasks');

    // save to DB
    let task = {
        task_name: newTask.value,
        task_description: newTaskDescription.value,
        task_deadline: newTaskDeadline.value
    }

    store.add(task);

    console.log('Task added');

    transaction.oncomplete = (event) => {
        console.log('Transaction completed: database modification finished');
    }

    db.close();
});
