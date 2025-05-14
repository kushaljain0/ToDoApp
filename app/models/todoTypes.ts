export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: Priority;
  completed: boolean;
}

export type SortDirection = 'asc' | 'desc';

export type SortField = 'completed' | 'title' | 'priority' | 'date';

export interface FilterState {
  showCompleted: boolean;
  searchText: string;
  dateFrom: string;
  dateTo: string;
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
} 