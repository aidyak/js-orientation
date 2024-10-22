const myButton = document.getElementById('add_button');
const newTask = document.getElementById('new_task');
const newTaskDescription = document.getElementById('task_description');
const newTaskDeadline = document.getElementById('task_deadline');

let show_task_name = document.getElementById('show_task_name');
let show_task_description = document.getElementById('show_task_description');
let show_task_deadline = document.getElementById('show_task_deadline');


let request = window.indexedDB.open('MyTestDatabase1', 1);

request.onerror = (event) => {
    console.log('Error opening database');
}

request.onsuccess = (event) => {
    console.log('Database opened successfully');
    let db = event.target.result;
    let transaction = db.transaction(['tasks'], 'readonly');
    let store = transaction.objectStore('tasks');
    let template = document.getElementById('task_template');

    store.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
            let clone = template.content.cloneNode(true);
            clone.querySelector('.task_name').textContent = cursor.value.task_name;
            clone.querySelector('.task_description').textContent = cursor.value.task_description;
            clone.querySelector('.task_deadline').textContent = cursor.value.task_deadline;
            document.getElementById('task_list').appendChild(clone);
            cursor.continue();
        } else {
            console.log(`Got all tasks`);
        }
    };
}

request.onupgradeneeded = (event) => {
    let db = event.target.result;
    console.log('Database upgrade needed');

    let store = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

    store.createIndex('task_name', 'task_name', { unique: false });
    store.createIndex('task_description', 'task_description', { unique: false });
    store.createIndex('task_deadline', 'task_deadline', { unique: false });

    console.log('Database setup complete');
    db.close();
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

    // reload page
    location.reload();
});

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        if (event.target.id === 'search_button') {
            let search_result = [];
            let search_input = document.getElementById('search_input').value;
            let db = request.result;
            let transaction = db.transaction(['tasks'], 'readonly');
            let store = transaction.objectStore('tasks');
            let template = document.getElementById('task_template');
            let task_list = document.getElementById('task_list');

            store.openCursor().onsuccess = (event) => {
                let cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.task_name.includes(search_input)) {
                        search_result.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    task_list.innerHTML = '';
                    search_result.forEach((task) => {
                        let clone = template.content.cloneNode(true);
                        clone.querySelector('.task_name').textContent = task.task_name;
                        clone.querySelector('.task_description').textContent = task.task_description;
                        clone.querySelector('.task_deadline').textContent = task.task_deadline;
                        document.getElementById('task_list').appendChild(clone);
                    });
                }
            }
        }
    })
})
