// src/utils/validation.js (New file - you can also place it inside App.jsx)

/**
 * Checks for immediate conflicts in the row, column, and 3x3 block
 * for the number just placed at (row, col).
 * @returns {Array<{row: number, col: number}>} An array of conflicting cell coordinates.
 */
export const checkImmediateConflicts = (board, row, col, value) => {
  if (value === 0) return []; // No conflict if the cell is empty

  const conflicts = [];
  const size = 9;
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  // 1. Check Row and Column
  for (let i = 0; i < size; i++) {
    // Check Row
    if (i !== col && board[row][i] === value) {
      conflicts.push({ row: row, col: i });
    }
    // Check Column
    if (i !== row && board[i][col] === value) {
      conflicts.push({ row: i, col: col });
    }
  }

  // 2. Check 3x3 Block
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const curRow = boxStartRow + r;
      const curCol = boxStartCol + c;

      // Skip the cell that was just changed
      if (curRow === row && curCol === col) continue;

      if (board[curRow][curCol] === value) {
        conflicts.push({ row: curRow, col: curCol });
      }
    }
  }

  // Add the current cell itself if any conflict was found elsewhere
  if (conflicts.length > 0) {
    conflicts.push({ row, col });
  }

  // Use a Set to remove duplicate conflict coordinates before returning
  const uniqueConflicts = Array.from(
    new Set(conflicts.map(c => `${c.row}-${c.col}`))
  ).map(str => {
    const [r, c] = str.split('-');
    return { row: parseInt(r), col: parseInt(c) };
  });

  return uniqueConflicts;
};
