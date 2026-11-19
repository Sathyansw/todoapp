import React from 'react';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const isOverdue =
    task.dueDate &&
    !task.isCompleted &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <div className="task-checkbox-container">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          title="Mark complete / incomplete"
        />
      </div>

      <div className="task-content">
        <div className="task-title-row">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-badges">
            {task.isCompleted ? (
              <span className="badge badge-success">Done</span>
            ) : (
              <span className="badge badge-pending">Pending</span>
            )}
            {isOverdue && <span className="badge badge-danger">Overdue</span>}
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          {task.dueDate && (
            <span className={`meta-item ${isOverdue ? 'text-danger font-bold' : ''}`}>
              📅 Due: {formatDueDate(task.dueDate)}
            </span>
          )}
          <span className="meta-item text-muted">
            🕒 Added {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label="Edit task"
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={() => onDelete(task.id)}
          title="Delete task"
          aria-label="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
