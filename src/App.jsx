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

  // Confetti control
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    fetchNewPuzzle();
  }, []);

  // Track window size for full-screen confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
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
      setInitialBoard(data.board.map(row => [...row])); // Deep copy
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      alert('Could not load puzzle. Ensure the backend server is running on port 5000.');
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
      validateBoard(newBoard)
        .then(response => {
          if (!response.isValid) {
            alert('Board is full but still contains errors (Backend check failed).');
          }
        })
        .catch(error => {
          console.error('Validation failed:', error);
        });
    }
  };

  const isGameWon = useMemo(() => {
    return board && board.flat().every(val => val !== 0) && conflicts.length === 0;
  }, [board, conflicts]);

  // Trigger confetti once
  useEffect(() => {
    if (isGameWon && !hasCelebrated) {
      setHasCelebrated(true);
    }
  }, [isGameWon, hasCelebrated]);

  return (
    <div
      className="App min-h-screen flex flex-col items-center py-12 px-4 
                 bg-gray-900 text-gray-100 font-sans 
                 bg-gradient-to-t from-gray-900 to-gray-800"
    >
      {/* Confetti */}
      {hasCelebrated && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={400}
          gravity={0.25}
          recycle={false}
        />
      )}

      <h1 className="text-5xl font-light text-white mb-2 tracking-widest uppercase border-b-2 border-teal-400 pb-2">
        Sudoku Master
      </h1>
      <p className="text-sm text-gray-400 mb-12 italic">A Modern Challenge</p>

      <button
        onClick={fetchNewPuzzle}
        disabled={loading}
        className="mb-14 px-10 py-3 bg-teal-600 text-white font-semibold rounded-full shadow-xl 
                   hover:bg-teal-500 active:scale-[0.98] disabled:opacity-50 
                   disabled:cursor-not-allowed transition duration-300 transform 
                   hover:shadow-teal-400/30 tracking-wider"
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Puzzle...
          </span>
        ) : (
          'NEW CHALLENGE'
        )}
      </button>

      {loading && (
        <p className="text-lg text-gray-400">
          Connecting to API and generating puzzle...
        </p>
      )}

      {!loading && board && initialBoard && (
        <>
          <SudokuGrid
            board={board}
            initialBoard={initialBoard}
            handleCellChange={handleCellChange}
            conflicts={conflicts}
          />

          {isGameWon && (
            <h2 className="mt-12 text-3xl font-bold text-teal-300 bg-gray-800 
                           border-2 border-teal-500 p-4 rounded-xl shadow-lg 
                           shadow-teal-400/20 tracking-wide">
              🎉 PUZZLE SOLVED! EXCELLENT WORK!
            </h2>
          )}
        </>
      )}
    </div>
  );
}

export default App;
