import { Priority, Todo, FilterState } from '../models/todoTypes';

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};

export const getPriorityClass = (priority: string): string => {
  switch (priority) {
    case Priority.High: return 'priority-high';
    case Priority.Medium: return 'priority-medium';
    case Priority.Low: return 'priority-low';
    default: return '';
  }
};

export const getDefaultDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const filterTodos = (todos: Todo[], filter: FilterState): Todo[] => {
  return todos.filter(todo => {
    // Filter by completion status
    if (!filter.showCompleted && todo.completed) {
      return false;
    }

    // Filter by search text
    if (filter.searchText && 
        !todo.title.toLowerCase().includes(filter.searchText.toLowerCase()) && 
        !todo.description.toLowerCase().includes(filter.searchText.toLowerCase())) {
      return false;
    }

    // Filter by date range
    const todoDate = new Date(todo.date);
    if (filter.dateFrom && new Date(filter.dateFrom) > todoDate) {
      return false;
    }
    if (filter.dateTo && new Date(filter.dateTo) < todoDate) {
      return false;
    }

    return true;
  });
}; 