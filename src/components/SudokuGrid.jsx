import React from 'react';
import Cell from './Cell';

const SudokuGrid = ({ board, initialBoard, handleCellChange, conflicts }) => {
  return (
    /* FIX: Changed 'w-max' to 'w-full'. 
       Added 'max-w-full' and 'aspect-square' to ensure it scales down on small screens.
    */
    <div className="grid grid-cols-9 border-[3px] md:border-4 border-gray-800 shadow-2xl rounded-sm md:rounded-lg overflow-hidden w-full aspect-square bg-gray-600">
      {board.map((rowArr, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {rowArr.map((value, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              row={rowIndex}
              col={colIndex}
              onChange={handleCellChange}
              isInitial={initialBoard[rowIndex][colIndex] !== 0}
              isConflict={conflicts.some(c => c.row === rowIndex && c.col === colIndex)}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SudokuGrid;
