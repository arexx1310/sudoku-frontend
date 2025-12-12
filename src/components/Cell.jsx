import React from 'react';

const Cell = ({ value, onChange, isInitial, isConflict, row, col }) => {
  // Base classes for the input field (cell)
  let cellClasses =
    'w-12 h-12 text-center text-2xl transition-all duration-300 ease-in-out appearance-none cursor-pointer';

  // Apply different styles based on cell state
  if (isInitial) {
    // Initial: Clean grey background, bold, dark text
    cellClasses += ' bg-gray-100 text-gray-800 font-extrabold cursor-default';
  } else {
    // User Input: Pure white background, distinguished text color
    cellClasses += ' bg-white text-indigo-700 font-bold';
    // Interactive: Subtle lift and deep ring on focus
    cellClasses += ' focus:bg-indigo-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:scale-[1.03] z-10 shadow-sm hover:shadow-md';
  }

  // Conflict Animation and Styling (Bright Red)
  if (isConflict) {
    // Strong visual feedback for error
    cellClasses += ' bg-red-200 text-red-800 animate-shake';
  }

  // Thicker Borders for 3x3 Blocks
  // The main grid container in SudokuGrid.jsx handles the outer border.
  // We use border-gray-300 for thin lines and border-gray-600 for thick separators.
  
  // Apply standard thin border
  cellClasses += ' border border-gray-300';
  
  // Override with thick border for 3x3 separation
  if (col % 3 === 2 && col !== 8) {
    cellClasses += ' border-r-[3px] border-r-gray-600'; // Increased thickness
  }
  if (row % 3 === 2 && row !== 8) {
    cellClasses += ' border-b-[3px] border-b-gray-600'; // Increased thickness
  }

  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^1-9]/g, '');

    if (!isInitial) {
      onChange(row, col, newValue ? parseInt(newValue) : 0);
    }
  };

  return (
    <input
      className={cellClasses}
      type="text"
      maxLength="1"
      value={value === 0 ? '' : value}
      onChange={handleChange}
      readOnly={isInitial}
    />
  );
};

export default Cell;