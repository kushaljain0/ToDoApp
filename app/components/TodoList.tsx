import React from 'react';
import { Todo as TodoType, SortState, SortField } from '../models/todoTypes';
import Todo from './Todo';
import { formatDate, getPriorityClass } from '../utils/todoUtils';

interface TodoListProps {
  todos: TodoType[];
  toggleComplete: (id: string) => void;
  sort: SortState;
  onSort: (field: SortField) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleComplete, sort, onSort }) => {
  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div>
      <table className="task-table">
        <thead>
          <tr>
            <th onClick={() => onSort('completed')}>
              Done {getSortIcon('completed')}
            </th>
            <th onClick={() => onSort('title')}>
              Title {getSortIcon('title')}
            </th>
            <th onClick={() => onSort('priority')}>
              Priority {getSortIcon('priority')}
            </th>
            <th onClick={() => onSort('date')}>
              Date {getSortIcon('date')}
            </th>
          </tr>
        </thead>
        <tbody>
          {todos.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>No tasks found</td>
            </tr>
          ) : (
            todos.map(todo => (
              <Todo 
                key={todo.id}
                todo={todo}
                toggleComplete={toggleComplete}
                getPriorityClass={getPriorityClass}
                formatDate={formatDate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList; 