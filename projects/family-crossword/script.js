function generateCrossword() {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // Clear old grid
  const input = document.getElementById("nameInput").value;
  const names = input.split(",").map(n => n.trim().toUpperCase());

  const gridSize = 20;
  const board = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

  // Very basic placement: one word per row starting at (0,0)
  names.forEach((word, i) => {
    for (let j = 0; j < word.length && j < gridSize; j++) {
      board[i][j] = word[j];
    }
  });

  // Render the board
  for (let row of board) {
    for (let cell of row) {
      const div = document.createElement("div");
      div.className = "cell";
      div.textContent = cell || "";
      grid.appendChild(div);
    }
  }
}
