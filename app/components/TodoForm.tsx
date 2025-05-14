import React, { useState } from 'react';
import { Priority, Todo } from '../models/todoTypes';
import { getDefaultDate } from '../utils/todoUtils';

interface TodoFormProps {
  onAddTodo: (todo: Omit<Todo, 'id' | 'completed'>) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getDefaultDate);
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    onAddTodo({
      title,
      description,
      date,
      priority
    });
    
    // Reset form fields except date
    setTitle('');
    setDescription('');
    setPriority(Priority.Medium);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-control">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value={Priority.Low}>{Priority.Low}</option>
            <option value={Priority.Medium}>{Priority.Medium}</option>
            <option value={Priority.High}>{Priority.High}</option>
          </select>
        </div>
        
        <div className="form-control">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-group">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      <button type="submit">Add</button>
    </form>
  );
};

export default TodoForm; 