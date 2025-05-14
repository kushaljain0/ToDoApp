import React, { useState, useEffect } from 'react';
import { Todo, Priority, SortState, FilterState, SortField, SortDirection } from '../models/todoTypes';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';
import { generateId, filterTodos } from '../utils/todoUtils';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        return JSON.parse(saved);
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
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
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