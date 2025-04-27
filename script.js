document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const openTaskModalBtn = document.getElementById('open-task-modal');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-tasks');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');
    const overdueTasksEl = document.getElementById('overdue-tasks');
    
    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let currentSort = 'newest';
    
    // Initialize
    init();
    
    function init() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
        
        // Event listeners
        themeToggle.addEventListener('change', toggleTheme);
        openTaskModalBtn.addEventListener('click', openTaskModal);
        closeModalBtn.addEventListener('click', closeTaskModal);
        taskForm.addEventListener('submit', handleTaskSubmit);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTasks();
            });
        });
        
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderTasks();
        });
        
        // Initial render
        renderTasks();
        updateStats();
    }
    
    function toggleTheme() {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    function openTaskModal() {
        taskModal.style.display = 'flex';
    }
    
    function closeTaskModal() {
        taskModal.style.display = 'none';
        taskForm.reset();
    }
    
    function handleTaskSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        const priority = document.getElementById('task-priority').value;
        const category = document.getElementById('task-category').value;
        
        const newTask = {
            id: Date.now(),
            title,
            description,
            dueDate,
            priority,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateStats();
        closeTaskModal();
    }
    
    function renderTasks() {
        // Filter tasks
        let filteredTasks = tasks.filter(task => {
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter === 'pending') return !task.completed;
            return true;
        });
        
        // Sort tasks
        filteredTasks = sortTasks(filteredTasks);
        
        // Render
        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <img src="assets/images/no-tasks.svg" alt="No tasks">
                    <h3>No tasks found</h3>
                    <p>Click "Add Task" to get started</p>
                </div>
            `;
            return;
        }
        
        taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.completed ? 'completed' : ''} ${task.category} priority-${task.priority}">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-actions">
                        <button class="complete-btn" data-id="${task.id}">
                            <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                        </button>
                        <button class="delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                <div class="task-footer">
                    <span class="task-category">${task.category}</span>
                    <span class="task-date">${formatDate(task.dueDate)}</span>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to new task buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', () => toggleTaskComplete(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteTask(btn.dataset.id));
        });
    }
    
    function sortTasks(tasksToSort) {
        return [...tasksToSort].sort((a, b) => {
            if (currentSort === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (currentSort === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else {
                // Priority sorting: high > medium > low
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
        });
    }
    
    function toggleTaskComplete(taskId) {
        tasks = tasks.map(task => {
            if (task.id == taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        updateStats();
    }
    
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id != taskId);
        saveTasks();
        renderTasks();
        updateStats();
    }
    
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const overdue = tasks.filter(task => 
            !task.completed && 
            task.dueDate && 
            new Date(task.dueDate) < new Date()
        ).length;
        
        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        pendingTasksEl.textContent = pending;
        overdueTasksEl.textContent = overdue;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'No due date';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeTaskModal();
        }
    });
});