import React from 'react';

const Cell = ({ value, onChange, isInitial, isConflict, row, col }) => {
  // FIXED: Removed w-12 h-12. Added w-full and aspect-square.
  // Added 'inputMode="numeric"' and responsive text sizes.
  let cellClasses =
    'w-full aspect-square text-center text-xl md:text-2xl transition-all duration-300 ease-in-out appearance-none cursor-pointer outline-none flex items-center justify-center';

  if (isInitial) {
    cellClasses += ' bg-gray-200 text-gray-800 font-extrabold cursor-default';
  } else {
    cellClasses += ' bg-white text-indigo-700 font-bold';
    cellClasses += ' focus:bg-indigo-50 focus:ring-2 focus:ring-inset focus:ring-indigo-400 z-10';
  }

  if (isConflict) {
    cellClasses += ' bg-red-200 text-red-800 animate-pulse';
  }

  // Borders
  cellClasses += ' border border-gray-300';
  
  if (col % 3 === 2 && col !== 8) {
    cellClasses += ' border-r-[2px] md:border-r-[3px] border-r-gray-700';
  }
  if (row % 3 === 2 && row !== 8) {
    cellClasses += ' border-b-[2px] md:border-b-[3px] border-b-gray-700';
  }

  const handleChange = (e) => {
    // Take the last character typed to allow easy overwriting
    const char = e.target.value.slice(-1);
    const newValue = char.replace(/[^1-9]/g, '');

    if (!isInitial) {
      onChange(row, col, newValue ? parseInt(newValue) : 0);
    }
  };

  return (
    <input
      className={cellClasses}
      type="text"
      inputMode="numeric" // Forces number pad on mobile
      pattern="[1-9]*"
      maxLength="1"
      value={value === 0 ? '' : value}
      onChange={handleChange}
      readOnly={isInitial}
    />
  );
};

export default Cell;
