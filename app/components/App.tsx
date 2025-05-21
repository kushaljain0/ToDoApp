import React, { useState, useEffect } from 'react';
import { Todo, Priority, SortState, FilterState, SortField, SortDirection } from '../models/todoTypes';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';
import { generateId, filterTodos } from '../utils/todoUtils';

// Helper to convert dd.mm.yyyy to yyyy-mm-dd
function parseDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('.');
  if (parts.length !== 3) return dateStr;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

// Migrate all tasks in localStorage to ISO date format
function migrateTodosToISO(todos: any[]): any[] {
  return todos.map(todo => {
    if (todo.date && /^\d{2}\.\d{2}\.\d{4}$/.test(todo.date)) {
      return { ...todo, date: parseDDMMYYYY(todo.date) };
    }
    return todo;
  });
}

// Robust date parser for sorting
function toDateObj(dateStr: string): Date {
  if (!dateStr) return new Date('');
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
    return new Date(parseDDMMYYYY(dateStr));
  }
  return new Date(dateStr);
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        parsed = migrateTodosToISO(parsed);
        localStorage.setItem('todos', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [filter, setFilter] = useState<FilterState>({
    showCompleted: true,
    searchText: '',
    dateFrom: '',
    dateTo: ''
  });

  const [sort, setSort] = useState<SortState>({
    field: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Omit<Todo, 'id' | 'completed'>) => {
    const newTodo: Todo = {
      id: generateId(),
      ...todo,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = filterTodos(todos, filter);

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let comparison = 0;
    switch (sort.field) {
      case 'completed':
        comparison = Number(a.completed) - Number(b.completed);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const priorityValues = { 
          [Priority.Low]: 1, 
          [Priority.Medium]: 2, 
          [Priority.High]: 3 
        };
        comparison = priorityValues[a.priority] - priorityValues[b.priority];
        break;
      case 'date':
        comparison = toDateObj(a.date).getTime() - toDateObj(b.date).getTime();
        break;
    }
    return sort.direction === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    setSort(prevSort => {
      if (prevSort.field === field) {
        return {
          ...prevSort,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        field,
        direction: 'asc'
      };
    });
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <div className="section">
        <div className="section-header">Add Task</div>
        <TodoForm onAddTodo={addTodo} />
      </div>
      <div className="section">
        <div className="section-header">Filter</div>
        <TodoFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="section">
        <TodoList 
          todos={sortedTodos} 
          toggleComplete={toggleComplete} 
          sort={sort}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default App; 