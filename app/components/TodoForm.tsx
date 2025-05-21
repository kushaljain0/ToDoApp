import React, { useRef, useState, useEffect } from 'react';
import { Priority, Todo } from '../models/todoTypes';
import { Validator } from '../utils/validator';
import { Calendar } from './calendar';
import '../styles/components.css';

// Convert dd.mm.yyyy to yyyy-mm-dd (ISO)
function parseDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('.');
  if (parts.length !== 3) return dateStr;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}
// Convert yyyy-mm-dd (ISO) to dd.mm.yyyy
function formatToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yyyy, mm, dd] = parts;
  return `${dd.padStart(2, '0')}.${mm.padStart(2, '0')}.${yyyy}`;
}

interface TodoFormProps {
  onAddTodo: (todo: Omit<Todo, 'id' | 'completed'>) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateISO, setDateISO] = useState(''); // ISO format for saving/filtering
  const [dateDisplay, setDateDisplay] = useState(''); // dd.mm.yyyy for input
  const [priority, setPriority] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Refs for validation and calendar
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const errorContainerRef = useRef<HTMLDivElement>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const validatorRef = useRef<Validator | null>(null);

  // Initialize validator
  useEffect(() => {
    if (errorContainerRef.current && !validatorRef.current) {
      validatorRef.current = new Validator(errorContainerRef.current.id);
    }
  }, []);

  // Calendar integration
  useEffect(() => {
    if (showCalendar && calendarContainerRef.current && dateRef.current) {
      new Calendar({
        containerId: calendarContainerRef.current.id,
        onDateSelect: (selectedDate) => {
          const iso = selectedDate.toISOString().split('T')[0];
          setDateISO(iso);
          setDateDisplay(formatToDDMMYYYY(iso));
          setShowCalendar(false);
        },
        initialDate: dateISO ? new Date(dateISO) : undefined
      });
    }
  }, [showCalendar, dateISO]);

  // Validation rule
  const required = (value: string) => value.trim().length > 0;

  // Handle manual date input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateDisplay(value);
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
      setDateISO(parseDDMMYYYY(value));
    } else {
      setDateISO('');
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatorRef.current) return;
    const validations = [
      { fieldName: 'Title', element: titleRef.current!, rules: [required], errorMessage: 'Title is required' },
      { fieldName: 'Priority', element: priorityRef.current!, rules: [required], errorMessage: 'Priority is required' },
      { fieldName: 'Date', element: dateRef.current!, rules: [required], errorMessage: 'Date is required' },
      { fieldName: 'Description', element: descRef.current!, rules: [required], errorMessage: 'Description is required' }
    ];
    if (validatorRef.current.validateForm(validations)) {
      onAddTodo({
        title,
        description,
        date: dateISO,
        priority: priority as Priority
      });
      setTitle('');
      setDescription('');
      setDateISO('');
      setDateDisplay('');
      setPriority('');
      validatorRef.current.clearErrors();
    }
  };

  // Position calendar below the date input
  const handleDateFocus = () => {
    setShowCalendar(true);
    setTimeout(() => {
      if (calendarContainerRef.current && dateRef.current) {
        const inputRect = dateRef.current.getBoundingClientRect();
        const formRect = dateRef.current.closest('form')?.getBoundingClientRect();
        let top = inputRect.bottom;
        let left = inputRect.left;
        if (formRect) {
          top = inputRect.bottom - formRect.top;
          left = inputRect.left - formRect.left;
        }
        calendarContainerRef.current.style.position = 'absolute';
        calendarContainerRef.current.style.top = `${top}px`;
        calendarContainerRef.current.style.left = `${left}px`;
        calendarContainerRef.current.style.zIndex = '10';
        calendarContainerRef.current.style.display = 'block';
      }
    }, 0);
  };

  // Hide calendar when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(e.target as Node) &&
        e.target !== dateRef.current
      ) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCalendar]);

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <div className="form-row" style={{ display: 'flex', gap: 8 }}>
        <input
          ref={titleRef}
          id="title-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <select
          ref={priorityRef}
          id="priority-input"
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value={Priority.High}>High</option>
          <option value={Priority.Medium}>Medium</option>
          <option value={Priority.Low}>Low</option>
        </select>
        <input
          ref={dateRef}
          id="date-input"
          type="text"
          placeholder="Date"
          value={dateDisplay}
          onFocus={handleDateFocus}
          onChange={handleDateChange}
        />
      </div>
      <div className="form-group" style={{ marginTop: 8 }}>
        <textarea
          ref={descRef}
          id="description-input"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <div
        id="error-container"
        ref={errorContainerRef}
        style={{ minHeight: 24, color: '#ff4444', fontSize: 14 }}
      ></div>
      <button type="submit" style={{ marginTop: 8 }}>Add</button>
      <div
        id="calendar-container"
        ref={calendarContainerRef}
        style={{ display: showCalendar ? 'block' : 'none' }}
      ></div>
    </form>
  );
};

export default TodoForm; 