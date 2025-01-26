const gameModeDiv = document.getElementById('game-mode');
const playerNamesDiv = document.getElementById('player-names');
const gameBoard = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const controlsDiv = document.getElementById('controls');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
const playAgainBtn = document.getElementById('play-again');

let currentPlayer = 'X';
let gameActive = false;
let gameState = ['', '', '', '', '', '', '', '', ''];
let players = { X: 'Player 1', O: 'Player 2' };
let gameMode = '';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
// Disable pull-to-refresh
document.addEventListener('touchmove', (e) => {
    if (e.touches[0].pageY > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
function startGame(mode) {
    gameMode = mode;
    gameModeDiv.classList.add('hidden');
    if (mode === 'friend') {
        playerNamesDiv.classList.remove('hidden');
    } else {
        players = { X: 'You', O: 'Bot' };
        initializeGame();
    }
}

document.getElementById('friend-mode').addEventListener('click', () => startGame('friend'));
document.getElementById('bot-mode').addEventListener('click', () => startGame('bot'));

document.getElementById('start-game').addEventListener('click', () => {
    const player1Name = document.getElementById('player1').value || 'Player 1';
    const player2Name = document.getElementById('player2').value || 'Player 2';
    players = { X: player1Name, O: player2Name };
    playerNamesDiv.classList.add('hidden');
    initializeGame();
});

function initializeGame() {
    gameBoard.classList.remove('hidden');
    statusDiv.classList.remove('hidden');
    controlsDiv.classList.remove('hidden');
    gameActive = true;
    updateStatus();
}

function updateStatus() {
    statusDiv.textContent = `${players[currentPlayer]}'s turn`;
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    checkResult();

    if (gameActive && gameMode === 'bot' && currentPlayer === 'O') {
        setTimeout(botMove, 500);
    }
}

function botMove() {
    const availableMoves = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const botChoice = availableMoves[randomIndex];
        gameState[botChoice] = currentPlayer;
        cells[botChoice].textContent = currentPlayer;
        checkResult();
    }
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDiv.textContent = `${players[currentPlayer]} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusDiv.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    updateStatus();

    if (gameMode === 'bot' && currentPlayer === 'O') {
        setTimeout(botMove, 500);
    }
}

function playAgain() {
    gameBoard.classList.add('hidden');
    statusDiv.classList.add('hidden');
    controlsDiv.classList.add('hidden');
    gameModeDiv.classList.remove('hidden');
    restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', playAgain);

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (gameActive) {
        const key = event.key;
        if (key >= '1' && key <= '9') {
            const index = parseInt(key) - 1;
            if (gameState[index] === '') {
                handleCellClick({ target: cells[index] });
            }
        }
    }
});

// Touch support is already handled by the click event listener

