let enteredNames = [];

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const name = nameInput.value.trim().toUpperCase();
      if (name && !enteredNames.includes(name)) {
        enteredNames.push(name);
        updateNameList();
      }
      // nameInput.value = "";
      nameInput.value = "";
    }
  });
});

function updateNameList() {
  const nameListDiv = document.getElementById("nameList");
  nameListDiv.innerHTML = "";
  enteredNames.forEach(name => {
    const tag = document.createElement("div");
    tag.className = "name-tag";
    tag.textContent = name;
    nameListDiv.appendChild(tag);
  });
}

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

function findAllIntersections(board, word) {
  const placements = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const boardChar = board[r][c];
      if (boardChar === emptyChar) continue;

      for (let wi = 0; wi < word.length; wi++) {
        if (word[wi] !== boardChar) continue;

        // Try vertical
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
          if (canPlace) {
            placements.push({ word, orientation: 'V', row: start
