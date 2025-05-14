import React from 'react';
import { Todo as TodoType } from '../models/todoTypes';

interface TodoProps {
  todo: TodoType;
  toggleComplete: (id: string) => void;
  getPriorityClass: (priority: string) => string;
  formatDate: (dateString: string) => string;
}

const Todo: React.FC<TodoProps> = ({ todo, toggleComplete, getPriorityClass, formatDate }) => {
  return (
    <tr className={todo.completed ? 'completed' : ''}>
      <td>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
        />
      </td>
      <td>
        <div>{todo.title}</div>
        {todo.description && (
          <div style={{ fontSize: '0.8em', color: '#666' }}>
            {todo.description}
          </div>
        )}
      </td>
      <td className={getPriorityClass(todo.priority)}>{todo.priority}</td>
      <td>{formatDate(todo.date)}</td>
    </tr>
  );
};

export default Todo; 