import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  loading,
  onToggle,
  onEdit,
  onDelete,
  filter,
}) {
  if (loading) {
    return (
      <div className="card loading-card">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="card empty-card">
        <div className="empty-icon">📝</div>
        <h4>No tasks found</h4>
        <p className="text-muted">
          {filter === 'completed'
            ? 'No completed tasks yet. Finish a task to see it here!'
            : filter === 'pending'
            ? 'Great job! You have no pending tasks.'
            : 'Get started by creating your first task above.'}
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
