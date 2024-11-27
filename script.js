document.addEventListener('DOMContentLoaded', () => {
    let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    const sections = ['communication', 'college-work', 'technical-skills', 'interview-prep', 'entertainment', 'food-bathing'];

    const currentDate = new Date().toLocaleDateString();
    document.getElementById('current-date').innerText = `Today: ${currentDate}`;

    // Add task functionality
    document.querySelectorAll('.add-task').forEach((button, index) => {
        button.addEventListener('click', () => {
            const taskName = sections[index];
            const taskDescription = prompt(`Enter task for ${taskName}:`);
            if (taskDescription) {
                const taskId = Date.now();
                taskHistory.push({
                    date: currentDate,
                    task: taskName,
                    taskId: taskId,
                    description: taskDescription,
                    completed: false,
                    notes: taskDescription,
                    emojis: []
                });
                localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
                alert('Task added!');
                updateNotesField(taskName, taskDescription);
            }
        });
    });

    function updateNotesField(taskName, description) {
        const notesTextArea = document.getElementById(`${taskName}-notes`);
        notesTextArea.value += `${description}\n`;
    }

    // Show task completion (with emoji selection)
    document.querySelectorAll('.complete-task').forEach((button, index) => {
        button.addEventListener('click', () => {
            const taskName = sections[index];
            const tasksInSection = taskHistory.filter(task => task.date === currentDate && task.task === taskName && !task.completed);

            if (tasksInSection.length === 0) {
                alert('No tasks to mark as complete!');
                return;
            }

            const taskListHTML = tasksInSection.map(task => `
                <label>
                    <input type="radio" name="task-complete" value="${task.taskId}">
                    ${task.description}
                </label><br>
            `).join('');

            const taskCompletionPrompt = document.createElement('div');
            taskCompletionPrompt.innerHTML = `
                <h3>Select Task to Mark as Complete</h3>
                ${taskListHTML}
                <button id="complete-task-button">Complete Task</button>
            `;

            document.body.appendChild(taskCompletionPrompt);

            document.getElementById('complete-task-button').addEventListener('click', () => {
                const selectedRadio = document.querySelector('input[name="task-complete"]:checked');
                if (selectedRadio) {
                    const selectedTaskId = selectedRadio.value;
                    const selectedTask = taskHistory.find(task => task.taskId == selectedTaskId);

                    if (selectedTask) {
                        const emojis = ['✅', '💪', '😄', '🎯', '🔥', '✨'];
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

                        selectedTask.completed = true;
                        selectedTask.emojis.push(randomEmoji);
                        localStorage.setItem('taskHistory', JSON.stringify(taskHistory));

                        const notesTextArea = document.getElementById(`${selectedTask.task}-notes`);
                        notesTextArea.value = `${selectedTask.description} ${randomEmoji}\n`;  // Update notes with emoji

                        document.body.removeChild(taskCompletionPrompt);
                        alert('Task marked as complete!');
                    }
                } else {
                    alert('Please select a task to mark as complete.');
                }
            });
        });
    });

    // View history functionality
    document.getElementById('view-history').addEventListener('click', () => {
        const history = taskHistory.map(task => task.date);
        const uniqueDates = [...new Set(history)];

        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        uniqueDates.forEach(date => {
            const listItem = document.createElement('li');
            listItem.textContent = date;
            listItem.addEventListener('click', () => {
                displayTasksForDate(date);
            });
            historyList.appendChild(listItem);
        });

        document.getElementById('history-section').style.display = 'block';
    });

    function displayTasksForDate(selectedDate) {
        const filteredTasks = taskHistory.filter(task => task.date === selectedDate);
        filteredTasks.forEach(task => {
            const notesTextArea = document.getElementById(`${task.task}-notes`);
            notesTextArea.value = `${task.description} Notes: ${task.notes} ${task.emojis.join(' ')}\n`;
        });

        document.getElementById('history-section').style.display = 'none';
    }

    // Save day functionality
    document.getElementById('save-day').addEventListener('click', () => {
        alert('Tasks saved for today!');
        // Automatically handled by saving to localStorage after every task change
    });

    // Hourly Notification functionality
    if (Notification.permission === "granted") {
        setInterval(() => {
            sendHourlyNotification();
        }, 60 * 60 * 1000); // Every hour (in milliseconds)
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                setInterval(() => {
                    sendHourlyNotification();
                }, 60 * 60 * 1000); // Every hour (in milliseconds)
            }
        });
    }

    // Function to send hourly notification
    function sendHourlyNotification() {
        new Notification("Hourly Reminder", {
            body: "Don't forget to check your tasks and mark them as complete!",
            icon: "https://via.placeholder.com/48",
        });
    }
});
