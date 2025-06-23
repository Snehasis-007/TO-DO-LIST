
        class TodoApp {
            constructor() {
                this.todos = [];
                this.currentFilter = 'all';
                this.initializeElements();
                this.attachEventListeners();
            }

            initializeElements() {
                this.taskInput = document.getElementById('taskInput');
                this.prioritySelect = document.getElementById('prioritySelect');
                this.addBtn = document.getElementById('addBtn');
                this.todoList = document.getElementById('todoList');
                this.totalTasksEl = document.getElementById('totalTasks');
                this.completedTasksEl = document.getElementById('completedTasks');
                this.pendingTasksEl = document.getElementById('pendingTasks');
                this.clearCompletedBtn = document.getElementById('clearCompleted');
                this.filterTabs = document.querySelectorAll('.filter-tab');
            }

            attachEventListeners() {
                this.addBtn.addEventListener('click', () => this.addTask());
                this.taskInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });
                
                this.filterTabs.forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        this.setFilter(e.target.dataset.filter);
                    });
                });

                this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
            }

            addTask() {
                const text = this.taskInput.value.trim();
                if (!text) return;

                const todo = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    priority: this.prioritySelect.value,
                    createdAt: new Date()
                };

                this.todos.unshift(todo);
                this.taskInput.value = '';
                this.render();
            }

            toggleTask(id) {
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.completed = !todo.completed;
                    this.render();
                }
            }

            deleteTask(id) {
                this.todos = this.todos.filter(t => t.id !== id);
                this.render();
            }

            setFilter(filter) {
                this.currentFilter = filter;
                this.filterTabs.forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.filter === filter);
                });
                this.render();
            }

            clearCompleted() {
                this.todos = this.todos.filter(t => !t.completed);
                this.render();
            }

            getFilteredTodos() {
                switch (this.currentFilter) {
                    case 'completed':
                        return this.todos.filter(t => t.completed);
                    case 'pending':
                        return this.todos.filter(t => !t.completed);
                    case 'high':
                        return this.todos.filter(t => t.priority === 'high');
                    default:
                        return this.todos;
                }
            }

            updateStats() {
                const total = this.todos.length;
                const completed = this.todos.filter(t => t.completed).length;
                const pending = total - completed;

                this.totalTasksEl.textContent = total;
                this.completedTasksEl.textContent = completed;
                this.pendingTasksEl.textContent = pending;

                this.clearCompletedBtn.style.display = completed > 0 ? 'block' : 'none';
            }

            render() {
                const filteredTodos = this.getFilteredTodos();
                
                if (filteredTodos.length === 0) {
                    this.todoList.innerHTML = `
                        <div class="empty-state">
                            <div style="font-size: 4rem; margin-bottom: 20px;">
                                ${this.currentFilter === 'completed' ? '🎉' : 
                                  this.currentFilter === 'pending' ? '⏳' : 
                                  this.currentFilter === 'high' ? '🔥' : '📝'}
                            </div>
                            <h3>${this.getEmptyMessage()}</h3>
                        </div>
                    `;
                } else {
                    this.todoList.innerHTML = filteredTodos.map(todo => `
                        <div class="todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}-priority">
                            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                                   onchange="app.toggleTask(${todo.id})">
                            <div class="todo-text">${todo.text}</div>
                            <span class="priority-badge priority-${todo.priority}">${todo.priority.toUpperCase()}</span>
                            <button class="delete-btn" onclick="app.deleteTask(${todo.id})">×</button>
                        </div>
                    `).join('');
                }

                this.updateStats();
            }

            getEmptyMessage() {
                switch (this.currentFilter) {
                    case 'completed':
                        return 'No completed tasks yet';
                    case 'pending':
                        return 'No pending tasks!';
                    case 'high':
                        return 'No high priority tasks';
                    default:
                        return 'No tasks yet';
                }
            }
        }

        // Initialize the app
        const app = new TodoApp();
    