const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const newGameButton = document.getElementById('new-game');

let board;
let score;
let size = 4;

function initGame() {
    board = Array(size).fill().map(() => Array(size).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
    updateBoard();
}

function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let tile = document.createElement('div');
            tile.className = `tile${board[i][j] !== 0 ? ' tile-' + board[i][j] : ''}`;
            tile.textContent = board[i][j] !== 0 ? board[i][j] : '';
            gameBoard.appendChild(tile);
        }
    }
    scoreElement.textContent = score;
}

function move(direction) {
    let moved = false;
    let newBoard = JSON.parse(JSON.stringify(board));

    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < size; i++) {
            let row = newBoard[i];
            row = direction === 'left' ? slide(row) : slide(row.reverse()).reverse();
            newBoard[i] = row;
            if (!moved && !arraysEqual(newBoard[i], board[i])) moved = true;
        }
    } else {
        for (let j = 0; j < size; j++) {
            let column = newBoard.map(row => row[j]);
            column = direction === 'up' ? slide(column) : slide(column.reverse()).reverse();
            for (let i = 0; i < size; i++) {
                newBoard[i][j] = column[i];
            }
            if (!moved && !arraysEqual(column, board.map(row => row[j]))) moved = true;
        }
    }

    if (moved) {
        board = newBoard;
        addNewTile();
        updateBoard();
        if (isGameOver()) {
            alert('Game Over! Your score: ' + score);
        }
    }
}

function slide(row) {
    let newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
        }
    }
    while (newRow.length < size) {
        newRow.push(0);
    }
    return newRow;
}

function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function isGameOver() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) return false;
            if (i < size - 1 && board[i][j] === board[i + 1][j]) return false;
            if (j < size - 1 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
    }
});

let touchStartX, touchStartY;

gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

gameBoard.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;

    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) move('right');
        else move('left');
    } else {
        if (deltaY > 0) move('down');
        else move('up');
    }

    touchStartX = null;
    touchStartY = null;
});

newGameButton.addEventListener('click', initGame);


// Disable pull-to-refresh
document.addEventListener('touchmove', (e) => {
    if (e.touches[0].pageY > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
initGame();