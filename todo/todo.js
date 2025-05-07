// Todo app functionality
document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Add initial todo for reading Davis Baer's story
    if (todos.length === 0) {
        todos.push({
            id: Date.now(),
            text: 'Read Davis Baer\'s story about OneUp marketing strategy',
            completed: false
        });
        saveTodos();
    }

    // Render todos
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <button class="todo-delete">×</button>
            `;

            // Toggle completion
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
            });

            // Delete todo
            const deleteBtn = li.querySelector('.todo-delete');
            deleteBtn.addEventListener('click', () => {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            });

            todoList.appendChild(li);
        });
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Add new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            todos.push({
                id: Date.now(),
                text,
                completed: false
            });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    });

    // Initial render
    renderTodos();
}); 