import { Priority, Todo, FilterState } from '../models/todoTypes';

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

// Convert dd.mm.yyyy to yyyy-mm-dd (ISO)
function parseDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('.');
  if (parts.length !== 3) return dateStr;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

// Check if a string is a valid ISO date (yyyy-mm-dd)
function isISODate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

// Format a date string (ISO or dd.mm.yyyy) to dd.mm.yyyy for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  let isoDate = dateString;
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
    isoDate = parseDDMMYYYY(dateString);
  }
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-GB');
};

// Get CSS class for priority
export const getPriorityClass = (priority: string): string => {
  switch (priority) {
    case Priority.High: return 'priority-high';
    case Priority.Medium: return 'priority-medium';
    case Priority.Low: return 'priority-low';
    default: return '';
  }
};

// Get today's date in ISO format
export const getDefaultDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Robust filter: only filter by date if todo.date is valid ISO and filter is set
export const filterTodos = (todos: Todo[], filter: FilterState): Todo[] => {
  return todos.filter(todo => {
    // Completion status
    if (!filter.showCompleted && todo.completed) return false;
    // Search text
    if (
      filter.searchText &&
      !todo.title.toLowerCase().includes(filter.searchText.toLowerCase()) &&
      !todo.description.toLowerCase().includes(filter.searchText.toLowerCase())
    ) return false;
    // Date range
    if ((filter.dateFrom || filter.dateTo)) {
      if (!isISODate(todo.date)) return false;
      if (filter.dateFrom && todo.date < filter.dateFrom) return false;
      if (filter.dateTo && todo.date > filter.dateTo) return false;
    }
    return true;
  });
}; 