const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GRID_SIZE = 20;

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(' '));
}

function canPlace(grid, word, x, y, dir) {
  const dx = dir === 'H' ? 1 : 0;
  const dy = dir === 'V' ? 1 : 0;

  for (let i = 0; i < word.length; i++) {
    const nx = x + i * dx;
    const ny = y + i * dy;

    if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) return false;

    const cell = grid[ny][nx];
    if (cell !== ' ' && cell !== word[i]) return false;

    if (cell === ' ') {
      if (
        (dx === 1 && (grid[ny - 1]?.[nx] || grid[ny + 1]?.[nx])) ||
        (dy === 1 && (grid[ny]?.[nx - 1] || grid[ny]?.[nx + 1]))
      ) return false;
    }
  }

  const before = grid[y - dy]?.[x - dx];
  const after = grid[y + dy * word.length]?.[x + dx * word.length];
  if (before || after) return false;

  return true;
}

function placeWord(grid, word, x, y, dir) {
  const dx = dir === 'H' ? 1 : 0;
  const dy = dir === 'V' ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    grid[y + i * dy][x + i * dx] = word[i];
  }
}

function permute(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  arr.forEach((el, i) => {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    permute(rest).forEach(p => result.push([el, ...p]));
  });
  return result;
}

function generateCrosswords(words) {
  const allLayouts = [];
  const permutations = permute(words);

  permutations.forEach(perm => {
    const grid = emptyGrid();
    const midY = Math.floor(GRID_SIZE / 2);
    const startX = Math.floor((GRID_SIZE - perm[0].length) / 2);
    placeWord(grid, perm[0], startX, midY, 'H');

    let success = true;

    for (let w = 1; w < perm.length; w++) {
      const word = perm[w];
      let placed = false;

      for (let i = 0; i < word.length && !placed; i++) {
        for (let y = 0; y < GRID_SIZE && !placed; y++) {
          for (let x = 0; x < GRID_SIZE && !placed; x++) {
            if (grid[y][x] === word[i]) {
              const vx = x - i, vy = y - i;
              if (canPlace(grid, word, vx, y, 'H')) {
                placeWord(grid, word, vx, y, 'H');
                placed = true;
              } else if (canPlace(grid, word, x, vy, 'V')) {
                placeWord(grid, word, x, vy, 'V');
                placed = true;
              }
            }
          }
        }
      }

      if (!placed) {
        success = false;
        break;
      }
    }

    if (success) {
      allLayouts.push(grid);
    }
  });

  return allLayouts;
}

app.post('/generate', (req, res) => {
  const { names } = req.body;
  if (!Array.isArray(names) || names.length < 2) {
    return res.status(400).json({ error: "Enter at least 2 names." });
  }

  const result = generateCrosswords(names.map(n => n.trim().toUpperCase()));
  res.json(result);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
