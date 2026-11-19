import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : '');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      ...(editingTask ? { isCompleted: editingTask.isCompleted } : {}),
    };

    onSubmit(payload);
    if (!editingTask) {
      resetForm();
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h3>{editingTask ? '✏️ Edit Task' : '➕ Add New Task'}</h3>
        {editingTask && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label htmlFor="task-title">Title <span className="text-danger">*</span></label>
          <input
            id="task-title"
            type="text"
            className="form-control"
            placeholder="e.g., Design database schema"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            maxLength={200}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc">Description (Optional)</label>
          <textarea
            id="task-desc"
            className="form-control"
            rows="3"
            placeholder="Add extra context or sub-tasks..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-due">Due Date (Optional)</label>
          <input
            id="task-due"
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingTask ? 'Save Changes' : 'Add Task'}
          </button>
          {!editingTask && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
