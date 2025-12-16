import React, { useState, useEffect, useMemo } from 'react';
import Confetti from 'react-confetti';
import SudokuGrid from './components/SudokuGrid';
import { getNewPuzzle, validateBoard } from './api/sudoku';
import { checkImmediateConflicts } from './utils/validation';

function App() {
  const [board, setBoard] = useState(null);
  const [initialBoard, setInitialBoard] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    fetchNewPuzzle();
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchNewPuzzle = async () => {
    setLoading(true);
    setConflicts([]);
    setHasCelebrated(false);
    try {
      const data = await getNewPuzzle('medium');
      setBoard(data.board);
      setInitialBoard(data.board.map(row => [...row]));
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      alert('Could not load puzzle. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCellChange = (row, col, value) => {
    if (initialBoard[row][col] !== 0) return;
    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? value : c))
    );
    setBoard(newBoard);
    const newConflicts = checkImmediateConflicts(newBoard, row, col, value);
    setConflicts(newConflicts);

    if (newBoard.flat().every(val => val !== 0) && newConflicts.length === 0) {
      validateBoard(newBoard).then(res => {
        if (!res.isValid) alert('Errors detected in the solution.');
      });
    }
  };

  const isGameWon = useMemo(() => {
    return board && board.flat().every(val => val !== 0) && conflicts.length === 0;
  }, [board, conflicts]);

  useEffect(() => {
    if (isGameWon && !hasCelebrated) setHasCelebrated(true);
  }, [isGameWon, hasCelebrated]);

  return (
    <div className="App min-h-screen w-full flex flex-col items-center bg-gray-900 text-gray-100 py-4 px-2 md:py-12 md:px-4 bg-gradient-to-t from-gray-900 to-gray-800">
      {hasCelebrated && (
        <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={400} gravity={0.25} recycle={false} />
      )}

      {/* Header - Shrunk for mobile */}
      <h1 className="text-3xl md:text-5xl font-light text-white mb-1 md:mb-2 tracking-widest uppercase border-b-2 border-teal-400 pb-1">
        Sudoku Master
      </h1>
      <p className="text-[10px] md:text-sm text-gray-400 mb-6 md:mb-12 italic">A Modern Challenge</p>

      {/* Action Button - Scaled down for mobile */}
      <button
        onClick={fetchNewPuzzle}
        disabled={loading}
        className="mb-8 md:mb-14 px-6 py-2 md:px-10 md:py-3 bg-teal-600 text-white font-semibold rounded-full shadow-xl hover:bg-teal-500 active:scale-95 transition duration-300"
      >
        {loading ? 'GENERATING...' : 'NEW CHALLENGE'}
      </button>

      {/* Grid Container - Key for proportions */}
      <div className="w-full max-w-[450px] aspect-square flex items-center justify-center">
        {!loading && board && initialBoard ? (
          <SudokuGrid
            board={board}
            initialBoard={initialBoard}
            handleCellChange={handleCellChange}
            conflicts={conflicts}
          />
        ) : (
          <div className="animate-pulse text-gray-500">Loading Grid...</div>
        )}
      </div>

      {isGameWon && (
        <h2 className="mt-6 text-xl md:text-3xl font-bold text-teal-300 bg-gray-800 border-2 border-teal-500 p-3 rounded-xl shadow-lg">
          🎉 PUZZLE SOLVED!
        </h2>
      )}
    </div>
  );
}

export default App;
