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
  [0,1,2],[3,4,5],[6,7,8],
  [2,1,0],[5,4,3],[8,7,6],
  [0,3,6],[1,4,7],[2,5,8],
  [6,3,0],[7,4,1],[8,5,2],
  [0,4,8],[2,4,6],
  [8,4,0],[6,4,2]
];

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

  if (vsBot && gameActive && currentPlayer === "O") {
    setTimeout(botMove, 500);
  }
}

function makeMove(index) {
  cells[index].textContent = currentPlayer;
  moveSound.play();

  if (checkWin(currentPlayer)) {
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
  }
}

function botMove() {
  const emptyIndices = cells
    .map((cell, i) => cell.textContent === "" ? i : null)
    .filter(i => i !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex);
}

function checkWin(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index].textContent === player)
  );
}

function updateScoreboard() {
  scoreX.textContent = `${playerNames.X}: ${scores.X}`;
  scoreO.textContent = `${playerNames.O}: ${scores.O}`;
}

resetBtn.addEventListener("click", initGame);