
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('todo-tasks')) || [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;

    setTasks([...tasks, {
      id: crypto.randomUUID(),
      title,
      completed: false
    }]);
    setInput('');
  }

  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const visibleTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  const completed = tasks.filter(task => task.completed).length;

  return (
    <main className="app">
      <section className="todo-card">
        <div className="eyebrow">YOUR DAILY PLANNER</div>
        <h1>My To-Do List <span>✦</span></h1>
        <p className="subtitle">Small steps make big progress.</p>

        <div className="progress">
          <div>
            <strong>{completed} of {tasks.length}</strong>
            <span> tasks completed</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${tasks.length ? completed / tasks.length * 100 : 0}%`
              }}
            />
          </div>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task"
            maxLength={200}
          />
          <button type="submit">+ Add</button>
        </form>

        <nav className="filters" aria-label="Filter tasks">
          {['All', 'Active', 'Completed'].map(item => (
            <button
              key={item}
              type="button"
              className={filter === item ? 'filter active' : 'filter'}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="task-list">
          {visibleTasks.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">✧</span>
              <p>{tasks.length ? 'No tasks in this filter.' : 'Your next great day starts here.'}</p>
              <small>Add a task above to get started.</small>
            </div>
          ) : visibleTasks.map(task => (
            <div className="task" key={task.id}>
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? 'task-title done' : 'task-title'}>
                  {task.title}
                </span>
              </label>
              <button
                className="delete"
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <footer>
          <span>{tasks.length - completed} tasks left to do</span>
          <span>One step at a time ♡</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
