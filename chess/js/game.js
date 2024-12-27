let game = null;
let bot = null;

function startGame(mode) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
    
    game = new ChessBoard();
    game.gameMode = mode;
    game.initializeBoard();
    
    if (mode === 'single') {
        bot = new ChessBot('BLACK');
    }
    
    game.renderBoard();
}

function goBack() {
    document.getElementById('gameArea').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    game = null;
    bot = null;
}

function showInstructions() {
    document.getElementById('instructionsModal').classList.remove('hidden');
}

function closeInstructions() {
    document.getElementById('instructionsModal').classList.add('hidden');
}

function handleSquareClick(row, col) {
    if (!game) return;
    
    const piece = game.board[row][col];
    
    // If it's bot's turn in single player mode, do nothing
    if (game.gameMode === 'single' && game.currentPlayer === 'BLACK') return;
    
    // If no piece is selected and clicked square has a piece of current player's color
    if (!game.selectedPiece && piece && piece.color === game.currentPlayer) {
        game.selectedPiece = piece;
        highlightValidMoves(piece);
    }
    // If a piece is selected, try to move it
    else if (game.selectedPiece) {
        const success = game.movePiece(game.selectedPiece.position, [row, col]);
        clearHighlights();
        game.selectedPiece = null;
        game.renderBoard();
        
        // If in single player mode and move was successful, make bot move
        if (success && game.gameMode === 'single') {
            setTimeout(makeBotMove, 500);
        }
    }
}

function makeBotMove() {
    if (!bot || !game) return;
    
    const move = bot.makeMove(game.board);
    if (move) {
        game.movePiece(move.from, move.to);
        game.renderBoard();
    }
}

function highlightValidMoves(piece) {
    clearHighlights();
    const validMoves = piece.getValidMoves(game.board);
    validMoves.forEach(([row, col]) => {
        const square = document.querySelector(`.board > div:nth-child(${row * 8 + col + 1})`);
        square.classList.add('highlight');
    });
}

function clearHighlights() {
    document.querySelectorAll('.square').forEach(square => {
        square.classList.remove('highlight');
    });
}