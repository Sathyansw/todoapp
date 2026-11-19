import React, { useState, useEffect, useMemo } from 'react';
import { todoService } from './services/todoService';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from backend API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getAll();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(
        'Unable to connect to the Web API backend. Please ensure the ASP.NET Core project is running on http://localhost:5001.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create or Update task
  const handleSaveTask = async (taskData) => {
    try {
      setError(null);
      if (editingTask) {
        const updated = await todoService.update(editingTask.id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? updated : t))
        );
        setEditingTask(null);
      } else {
        const created = await todoService.create(taskData);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
    }
  };

  // Toggle task complete/incomplete
  const handleToggle = async (id) => {
    try {
      setError(null);
      const updated = await todoService.toggle(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message || 'Failed to toggle task status.');
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setError(null);
      await todoService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask && editingTask.id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task.');
    }
  };

  // Start editing
  const handleStartEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (filter === 'pending') return !task.isCompleted;
      if (filter === 'completed') return task.isCompleted;
      return true;
    });
  }, [tasks, filter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📋 Task Manager</h1>
          <p className="subtitle">
            Full-stack To-Do app with React, ASP.NET Core Web API, Entity Framework Core & SQL Server
          </p>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="alert alert-danger banner-alert">
            <div className="alert-content">
              <strong>Connection Notice:</strong> {error}
            </div>
            <button className="btn btn-sm btn-secondary" onClick={fetchTasks}>
              Retry 🔄
            </button>
          </div>
        )}

        <div className="layout-grid">
          {/* Left Column: Form */}
          <aside className="form-column">
            <TaskForm
              onSubmit={handleSaveTask}
              editingTask={editingTask}
              onCancelEdit={handleCancelEdit}
            />

            <div className="card tech-card">
              <h4>🛠️ Project Architecture</h4>
              <ul className="tech-list">
                <li><strong>Frontend:</strong> React 18, Vite, Hooks</li>
                <li><strong>Backend:</strong> ASP.NET Core 8 Web API</li>
                <li><strong>ORM:</strong> Entity Framework Core (EF Core)</li>
                <li><strong>Database:</strong> Microsoft SQL Server</li>
                <li><strong>Operations:</strong> Full CRUD + Toggle + Filter</li>
              </ul>
            </div>
          </aside>

          {/* Right Column: List & Filters */}
          <section className="list-column">
            <FilterBar
              currentFilter={filter}
              onFilterChange={setFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              stats={stats}
            />

            <TaskList
              tasks={filteredTasks}
              loading={loading}
              onToggle={handleToggle}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
              filter={filter}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React &bull; ASP.NET Core &bull; EF Core &bull; SQL Server</p>
      </footer>
    </div>
  );
}
