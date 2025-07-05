const gridSize = 30;
const emptyChar = '';

function createEmptyBoard() {
  return Array.from({ length: gridSize }, () => Array(gridSize).fill(emptyChar));
}

function placeFirstWord(board, word) {
  const row = Math.floor(gridSize / 2);
  const col = Math.floor((gridSize - word.length) / 2);
  for (let i = 0; i < word.length; i++) {
    board[row][col + i] = word[i];
  }
  return { orientation: 'H', row, col };
}

function findIntersections(board, word) {
  const placements = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const boardChar = board[r][c];
      if (boardChar === emptyChar) continue;

      for (let wi = 0; wi < word.length; wi++) {
        if (word[wi] !== boardChar) continue;

        // Try vertical placement if board has a horizontal word here
        const startRow = r - wi;
        if (startRow >= 0 && startRow + word.length <= gridSize) {
          let canPlace = true;
          for (let k = 0; k < word.length; k++) {
            const cell = board[startRow + k][c];
            if (cell !== emptyChar && cell !== word[k]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) placements.push({ word, orientation: 'V', row: startRow, col: c });
        }

        // Try horizontal placement if board has a vertical word here
        const startCol = c - wi;
        if (startCol >= 0 && startCol + word.length <= gridSize) {
          let canPlace = true;
          for (let k = 0; k < word.length; k++) {
            const cell = board[r][startCol + k];
            if (cell !== emptyChar && cell !== word[k]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) placements.push({ word, orientation: 'H', row: r, col: startCol });
        }
      }
    }
  }
  return placements;
}

function placeWord(board, placement) {
  const { word, orientation, row, col } = placement;
  if (orientation === 'H') {
    for (let i = 0; i < word.length; i++) {
      board[row][col + i] = word[i];
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      board[row + i][col] = word[i];
    }
  }
}

function generateCrossword() {
  const input = document.getElementById("nameInput").value;
  const words = input
    .split(",")
    .map(w => w.trim().toUpperCase())
    .filter(w => w.length > 0);

  if (words.length === 0) return;

  const board = createEmptyBoard();
  const usedWords = [];

  // Place first word at center
  const firstWord = words.shift();
  placeFirstWord(board, firstWord);
  usedWords.push(firstWord);

  // Try placing the rest
  for (const word of words) {
    const placements = findIntersections(board, word);
    if (placements.length > 0) {
      placeWord(board, placements[0]); // Place first valid
      usedWords.push(word);
    }
  }

  renderBoard(board);
}

function renderBoard(board) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  for (let row of board) {
    const rowDiv = document.createElement("div");
    for (let cell of row) {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      cellDiv.textContent = cell;
      rowDiv.appendChild(cellDiv);
    }
    grid.appendChild(rowDiv);
  }
}
