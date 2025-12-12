const API_URL = import.meta.env.VITE_API_URL;

export const getNewPuzzle = async (difficulty) => {
  const res = await fetch(`${API_URL}/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ difficulty })
  });

  if (!res.ok) {
    throw new Error("Failed to fetch puzzle");
  }

  return res.json();
};

export const validateBoard = async (board) => {
  const res = await fetch(`${API_URL}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board })
  });

  return res.json();
};
