let grid = [];
let solution = [];
let size = 0;
let subSize = 0;

const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const sudokuGrid = document.getElementById('sudoku-grid');
const restartButton = document.getElementById('restart');
const homeButton = document.getElementById('home');
const instructionsButton = document.getElementById('instructions');
const instructionsModal = document.getElementById('instructions-modal');
const closeModal = document.getElementsByClassName('close')[0];

document.getElementById('easy').addEventListener('click', () => startGame('easy'));
document.getElementById('medium').addEventListener('click', () => startGame('medium'));
document.getElementById('hard').addEventListener('click', () => startGame('hard'));
restartButton.addEventListener('click', restartGame);
homeButton.addEventListener('click', goHome);
instructionsButton.addEventListener('click', showInstructions);
closeModal.addEventListener('click', hideInstructions);

function startGame(difficulty) {
    size = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 9 : 16;
    subSize = Math.sqrt(size);
    generatePuzzle();
    renderGrid();
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
}

function generatePuzzle() {
    solution = [];
    for (let i = 0; i < size; i++) {
        solution.push(new Array(size).fill(0));
    }
    solveSudoku(solution);
    
    grid = JSON.parse(JSON.stringify(solution));
    const cellsToRemove = Math.floor(size * size * (size === 4 ? 0.3 : size === 9 ? 0.5 : 0.7));
    for (let i = 0; i < cellsToRemove; i++) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        grid[row][col] = 0;
    }
}

function solveSudoku(board) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= size; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board, row, col, num) {
    for (let x = 0; x < size; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }
    
    const boxRow = Math.floor(row / subSize) * subSize;
    const boxCol = Math.floor(col / subSize) * subSize;
    for (let i = 0; i < subSize; i++) {
        for (let j = 0; j < subSize; j++) {
            if (board[boxRow + i][boxCol + j] === num) {
                return false;
            }
        }
    }
    
    return true;
}

function renderGrid() {
    sudokuGrid.innerHTML = '';
    sudokuGrid.style.gridTemplateColumns = `repeat(${size}, auto)`;
    
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (grid[row][col] !== 0) {
                cell.textContent = grid[row][col];
                cell.classList.add('given');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.addEventListener('input', (e) => handleInput(e, row, col));
                cell.appendChild(input);
            }
            if (col % subSize === subSize - 1) cell.style.borderRight = '2px solid black';
            if (row % subSize === subSize - 1) cell.style.borderBottom = '2px solid black';
            sudokuGrid.appendChild(cell);
        }
    }
}

function handleInput(e, row, col) {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= size)) {
        grid[row][col] = value === '' ? 0 : parseInt(value);
    } else {
        e.target.value = '';
    }
}

function restartGame() {
    generatePuzzle();
    renderGrid();
}

function goHome() {
    homeScreen.style.display = 'block';
    gameScreen.style.display = 'none';
}

function showInstructions() {
    instructionsModal.style.display = 'block';
}

function hideInstructions() {
    instructionsModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == instructionsModal) {
        instructionsModal.style.display = 'none';
    }
}

