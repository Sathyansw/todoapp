const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api/todoitems';

export const todoService = {
  // Fetch all tasks with optional search or completion filter
  getAll: async (search = '', isCompleted = null) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (isCompleted !== null) params.append('isCompleted', isCompleted);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}${queryString}`);
    if (!res.ok) {
      throw new Error(`Failed to load tasks (Status: ${res.status})`);
    }
    return res.json();
  },

  // Get a single task by ID
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to load task #${id} (Status: ${res.status})`);
    }
    return res.json();
  },

  // Create a new task
  create: async (task) => {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.title || `Failed to create task (Status: ${res.status})`);
    }
    return res.json();
  },

  // Update an existing task
  update: async (id, task) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.title || `Failed to update task (Status: ${res.status})`);
    }
    return res.json();
  },

  // Toggle complete / incomplete status
  toggle: async (id) => {
    const res = await fetch(`${API_BASE_URL}/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error(`Failed to toggle task status (Status: ${res.status})`);
    }
    return res.json();
  },

  // Delete a task
  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to delete task (Status: ${res.status})`);
    }
    return true;
  },
};
