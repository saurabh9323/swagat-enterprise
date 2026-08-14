import React from 'react';
import { Filter, Search } from 'lucide-react';

export default function PropertyFilters({ query, budget, onQueryChange, onBudgetChange }) {
  return (
    <div className="toolbar property-toolbar">
      <label>
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search Nalasopara, Ostwal, station, shop, 1 BHK..."
        />
      </label>
      <div className="select-wrap">
        <Filter size={18} />
        <select value={budget} onChange={(event) => onBudgetChange(event.target.value)}>
          <option value="all">All references</option>
          <option value="under45">Sale under 45L</option>
          <option value="family">Family 2 BHK</option>
          <option value="rent">Rental and shop rent</option>
        </select>
      </div>
    </div>
  );
}
