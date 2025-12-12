import React from 'react';
import Cell from './Cell';

const SudokuGrid = ({ board, initialBoard, handleCellChange, conflicts }) => {

  return (
    // The main grid container with a pronounced shadow and distinct border
    <div className="grid grid-cols-9 border-4 border-gray-800 shadow-2xl rounded-lg overflow-hidden mx-auto w-max bg-gray-600">
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