class ChessBoard {
    constructor() {
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        this.selectedPiece = null;
        this.currentPlayer = 'WHITE';
        this.gameMode = null;
    }

    initializeBoard() {
        // Set up pieces
        const setup = [
            ['ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK'],
            Array(8).fill('PAWN')
        ];

        // Place pieces
        for (let i = 0; i < 8; i++) {
            // Black pieces
            this.board[0][i] = new Piece(setup[0][i], 'BLACK', [0, i]);
            this.board[1][i] = new Piece(setup[1][i], 'BLACK', [1, i]);

            // White pieces
            this.board[7][i] = new Piece(setup[0][i], 'WHITE', [7, i]);
            this.board[6][i] = new Piece(setup[1][i], 'WHITE', [6, i]);
        }
    }

    movePiece(fromPos, toPos) {
        const [fromRow, fromCol] = fromPos;
        const [toRow, toCol] = toPos;
        
        const piece = this.board[fromRow][fromCol];
        if (!piece || piece.color !== this.currentPlayer) return false;

        // Move validation
        const validMoves = piece.getValidMoves(this.board);
        if (!validMoves.some(([r, c]) => r === toRow && c === toCol)) {
            return false;
        }

        // Execute move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        piece.position = [toRow, toCol];
        piece.hasMoved = true;

        // Check for pawn promotion
        if (piece.type === 'PAWN' && (toRow === 0 || toRow === 7)) {
            this.showPromotionDialog(piece);
        }

        this.currentPlayer = this.currentPlayer === 'WHITE' ? 'BLACK' : 'WHITE';
        document.querySelector('.turn-indicator').textContent = `${this.currentPlayer}'s Turn`;
        return true;
    }

    showPromotionDialog(piece) {
        const modal = document.getElementById('promotionModal');
        const content = modal.querySelector('.promotion-pieces');
        content.innerHTML = '';

        ['QUEEN', 'ROOK', 'BISHOP', 'KNIGHT'].forEach(type => {
            const pieceDiv = document.createElement('div');
            pieceDiv.className = 'piece';
            pieceDiv.textContent = PIECES[`${piece.color}_${type}`];
            pieceDiv.onclick = () => this.promotePawn(piece, type);
            content.appendChild(pieceDiv);
        });

        modal.classList.remove('hidden');
    }

    promotePawn(pawn, newType) {
        const [row, col] = pawn.position;
        this.board[row][col] = new Piece(newType, pawn.color, [row, col]);
        document.getElementById('promotionModal').classList.add('hidden');
        this.renderBoard();
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = PIECES[`${piece.color}_${piece.type}`];
                    square.appendChild(pieceElement);
                }

                square.onclick = () => handleSquareClick(row, col);
                boardElement.appendChild(square);
            }
        }
    }
}