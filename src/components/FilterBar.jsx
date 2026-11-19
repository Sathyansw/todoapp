import React from 'react';

export default function FilterBar({
  currentFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  stats,
}) {
  return (
    <div className="filter-bar card">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or details..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-tabs-wrapper">
        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All <span className="tab-count">{stats.total}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${currentFilter === 'pending' ? 'active' : ''}`}
            onClick={() => onFilterChange('pending')}
          >
            Pending <span className="tab-count">{stats.pending}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            Completed <span className="tab-count">{stats.completed}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
