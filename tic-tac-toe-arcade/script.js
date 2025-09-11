// 🌙 Theme Toggle with Local Storage
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
} else {
  body.classList.remove("dark-mode");
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

// 🎮 Game Setup
const board = document.getElementById("board");
const status = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const startBtn = document.getElementById("startGame");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let cells = [];
let currentPlayer = "X";
let gameActive = false;
let playerNames = { X: "Player 1", O: "Player 2" };
let scores = { X: 0, O: 0 };
let vsBot = false;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // columns
  [0,4,8],[2,4,6]          // diagonals
];

// 🎮 Start Game
startBtn.addEventListener("click", () => {
  playerNames.X = player1Input.value || "Player 1";
  const p2Name = player2Input.value.trim();

  if (p2Name === "") {
    vsBot = true;
    playerNames.O = "Sara";
  } else {
    vsBot = false;
    playerNames.O = p2Name;
  }

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";
  initGame();
});

function initGame() {
  board.innerHTML = "";
  cells = [];
  currentPlayer = "X";
  gameActive = true;
  status.textContent = `${playerNames[currentPlayer]}'s turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleMove(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index].textContent) return;
  makeMove(index);
}

function makeMove(index) {
  cells[index].textContent = currentPlayer;
  moveSound.play();

  if (checkLiveWin(currentPlayer)) {
    status.textContent = `${playerNames[currentPlayer]} wins!`;
    winSound.play();
    scores[currentPlayer]++;
    updateScoreboard();
    gameActive = false;
  } else if (cells.every(cell => cell.textContent)) {
    status.textContent = "It's a draw!";
    drawSound.play();
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `${playerNames[currentPlayer]}'s turn`;

    if (vsBot && gameActive && currentPlayer === "O") {
      setTimeout(botMove, 500);
    }
  }
}

function botMove() {
  const boardState = getBoardState();
  const bestMove = findBestMove(boardState);
  makeMove(bestMove);
}

function getBoardState() {
  return cells.map(cell => cell.textContent);
}

function findBestMove(boardState) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === "") {
      boardState[i] = "O";
      let score = minimax(boardState, 0, false);
      boardState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  const winner = evaluateWinner(boardState);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (!boardState.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function evaluateWinner(boardState) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a];
    }
  }
  return null;
}

function checkLiveWin(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index].textContent === player)
  );
}

function updateScoreboard() {
  scoreX.textContent = `${playerNames.X}: ${scores.X}`;
  scoreO.textContent = `${playerNames.O}: ${scores.O}`;
}

resetBtn.addEventListener("click", initGame);