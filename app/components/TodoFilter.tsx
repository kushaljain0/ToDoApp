import React, { useRef, useState, useEffect } from 'react';
import { FilterState } from '../models/todoTypes';
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

interface TodoFilterProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ filter, setFilter }) => {
  // Local state for the filter form
  const [showCalendarFrom, setShowCalendarFrom] = useState(false);
  const [showCalendarTo, setShowCalendarTo] = useState(false);
  const [localShowCompleted, setLocalShowCompleted] = useState(filter.showCompleted);
  const [localSearchText, setLocalSearchText] = useState(filter.searchText);
  const [localDateFrom, setLocalDateFrom] = useState(filter.dateFrom); // ISO format
  const [localDateTo, setLocalDateTo] = useState(filter.dateTo); // ISO format

  const dateFromRef = useRef<HTMLInputElement>(null);
  const dateToRef = useRef<HTMLInputElement>(null);
  const errorContainerRef = useRef<HTMLDivElement>(null);
  const calendarFromRef = useRef<HTMLDivElement>(null);
  const calendarToRef = useRef<HTMLDivElement>(null);
  const validatorRef = useRef<Validator | null>(null);

  // Initialize validator
  useEffect(() => {
    if (errorContainerRef.current && !validatorRef.current) {
      validatorRef.current = new Validator(errorContainerRef.current.id);
    }
  }, []);

  // Calendar integration for Date From
  useEffect(() => {
    if (showCalendarFrom && calendarFromRef.current && dateFromRef.current) {
      new Calendar({
        containerId: calendarFromRef.current.id,
        onDateSelect: (selectedDate) => {
          const iso = selectedDate.toISOString().split('T')[0];
          setLocalDateFrom(iso);
          setShowCalendarFrom(false);
        },
        initialDate: localDateFrom ? new Date(localDateFrom) : undefined
      });
    }
  }, [showCalendarFrom, localDateFrom]);

  // Calendar integration for Date To
  useEffect(() => {
    if (showCalendarTo && calendarToRef.current && dateToRef.current) {
      new Calendar({
        containerId: calendarToRef.current.id,
        onDateSelect: (selectedDate) => {
          const iso = selectedDate.toISOString().split('T')[0];
          setLocalDateTo(iso);
          setShowCalendarTo(false);
        },
        initialDate: localDateTo ? new Date(localDateTo) : undefined
      });
    }
  }, [showCalendarTo, localDateTo]);

  // Validation: Date From should not be after Date To
  useEffect(() => {
    if (!validatorRef.current) return;
    validatorRef.current.clearErrors();
    if (localDateFrom && localDateTo) {
      const from = new Date(localDateFrom);
      const to = new Date(localDateTo);
      if (from > to) {
        validatorRef.current.validateForm([
          {
            fieldName: 'Date Range',
            element: dateFromRef.current!,
            rules: [() => false],
            errorMessage: 'Date From cannot be after Date To'
          },
          {
            fieldName: 'Date Range',
            element: dateToRef.current!,
            rules: [() => false],
            errorMessage: 'Date To cannot be before Date From'
          }
        ]);
      }
    }
  }, [localDateFrom, localDateTo]);

  // Position calendar below the input
  const handleDateFocus = (which: 'from' | 'to') => {
    if (which === 'from') {
      setShowCalendarFrom(true);
      setTimeout(() => {
        if (calendarFromRef.current && dateFromRef.current) {
          const inputRect = dateFromRef.current.getBoundingClientRect();
          const formRect = dateFromRef.current.closest('form')?.getBoundingClientRect();
          let top = inputRect.bottom;
          let left = inputRect.left;
          if (formRect) {
            top = inputRect.bottom - formRect.top;
            left = inputRect.left - formRect.left;
          }
          calendarFromRef.current.style.position = 'absolute';
          calendarFromRef.current.style.top = `${top}px`;
          calendarFromRef.current.style.left = `${left}px`;
          calendarFromRef.current.style.zIndex = '10';
          calendarFromRef.current.style.display = 'block';
        }
      }, 0);
    } else {
      setShowCalendarTo(true);
      setTimeout(() => {
        if (calendarToRef.current && dateToRef.current) {
          const inputRect = dateToRef.current.getBoundingClientRect();
          const formRect = dateToRef.current.closest('form')?.getBoundingClientRect();
          let top = inputRect.bottom;
          let left = inputRect.left;
          if (formRect) {
            top = inputRect.bottom - formRect.top;
            left = inputRect.left - formRect.left;
          }
          calendarToRef.current.style.position = 'absolute';
          calendarToRef.current.style.top = `${top}px`;
          calendarToRef.current.style.left = `${left}px`;
          calendarToRef.current.style.zIndex = '10';
          calendarToRef.current.style.display = 'block';
        }
      }, 0);
    }
  };

  // Hide calendar when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        showCalendarFrom && calendarFromRef.current &&
        !calendarFromRef.current.contains(e.target as Node) &&
        e.target !== dateFromRef.current
      ) {
        setShowCalendarFrom(false);
      }
      if (
        showCalendarTo && calendarToRef.current &&
        !calendarToRef.current.contains(e.target as Node) &&
        e.target !== dateToRef.current
      ) {
        setShowCalendarTo(false);
      }
    };
    if (showCalendarFrom || showCalendarTo) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCalendarFrom, showCalendarTo]);

  // Apply filter button handler
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({
      showCompleted: localShowCompleted,
      searchText: localSearchText,
      dateFrom: localDateFrom,
      dateTo: localDateTo
    });
  };

  return (
    <form style={{ position: 'relative' }} onSubmit={handleApplyFilter}>
      <div className="filter-section">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={localShowCompleted} 
            onChange={e => setLocalShowCompleted(e.target.checked)} 
          />
          Show completed
        </label>
        <div className="form-control">
          <input
            ref={dateFromRef}
            id="date-from-input"
            type="text"
            placeholder="Date From"
            value={formatToDDMMYYYY(localDateFrom)}
            onFocus={() => handleDateFocus('from')}
            readOnly
          />
          <div
            id="calendar-from-container"
            ref={calendarFromRef}
            style={{ display: showCalendarFrom ? 'block' : 'none' }}
          ></div>
        </div>
        <div className="form-control">
          <input
            ref={dateToRef}
            id="date-to-input"
            type="text"
            placeholder="Date To"
            value={formatToDDMMYYYY(localDateTo)}
            onFocus={() => handleDateFocus('to')}
            readOnly
          />
          <div
            id="calendar-to-container"
            ref={calendarToRef}
            style={{ display: showCalendarTo ? 'block' : 'none' }}
          ></div>
        </div>
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Text search (title + description)"
          value={localSearchText}
          onChange={e => setLocalSearchText(e.target.value)}
        />
      </div>
      <div
        id="filter-error-container"
        ref={errorContainerRef}
        style={{ minHeight: 24, color: '#ff4444', fontSize: 14 }}
      ></div>
      <button type="submit" style={{ marginTop: 8 }}>Apply Filter</button>
    </form>
  );
};

export default TodoFilter; 