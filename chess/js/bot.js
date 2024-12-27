class ChessBot {
    constructor(color) {
        this.color = color;
    }

    makeMove(board) {
        // Simple bot implementation
        const allMoves = this.getAllPossibleMoves(board);
        if (allMoves.length === 0) return null;

        // Randomly select a move
        const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        return randomMove;
    }

    getAllPossibleMoves(board) {
        const moves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.color === this.color) {
                    const validMoves = piece.getValidMoves(board);
                    validMoves.forEach(([toRow, toCol]) => {
                        moves.push({
                            from: [row, col],
                            to: [toRow, toCol]
                        });
                    });
                }
            }
        }

        return moves;
    }
}