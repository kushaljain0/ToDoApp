import React from 'react';
import { FilterState } from '../models/todoTypes';

interface TodoFilterProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ filter, setFilter }) => {
  const handleShowCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, showCompleted: e.target.checked });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, searchText: e.target.value });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, dateFrom: e.target.value });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, dateTo: e.target.value });
  };

  return (
    <div>
      <div className="filter-section">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filter.showCompleted} 
            onChange={handleShowCompletedChange} 
          />
          Show completed
        </label>
        
        <div className="form-control">
          <input
            type="date"
            placeholder="Date From"
            value={filter.dateFrom}
            onChange={handleDateFromChange}
          />
        </div>
        
        <div className="form-control">
          <input
            type="date"
            placeholder="Date To"
            value={filter.dateTo}
            onChange={handleDateToChange}
          />
        </div>
      </div>
      
      <div className="form-group">
        <input
          type="text"
          placeholder="Text search (title + description)"
          value={filter.searchText}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default TodoFilter; 