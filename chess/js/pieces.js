const PIECES = {
    WHITE_KING: '♔',
    WHITE_QUEEN: '♕',
    WHITE_ROOK: '♖',
    WHITE_BISHOP: '♗',
    WHITE_KNIGHT: '♘',
    WHITE_PAWN: '♙',
    BLACK_KING: '♚',
    BLACK_QUEEN: '♛',
    BLACK_ROOK: '♜',
    BLACK_BISHOP: '♝',
    BLACK_KNIGHT: '♞',
    BLACK_PAWN: '♟'
};

class Piece {
    constructor(type, color, position) {
        this.type = type;
        this.color = color;
        this.position = position;
        this.hasMoved = false;
    }

    getValidMoves(board) {
        const moves = [];
        const [row, col] = this.position;

        switch (this.type) {
            case 'PAWN':
                const direction = this.color === 'WHITE' ? -1 : 1;
                // Forward move
                if (board[row + direction]?.[col] === null) {
                    moves.push([row + direction, col]);
                    // Initial two-square move
                    if (!this.hasMoved && board[row + 2 * direction]?.[col] === null) {
                        moves.push([row + 2 * direction, col]);
                    }
                }
                // Captures
                [-1, 1].forEach(dx => {
                    const newRow = row + direction;
                    const newCol = col + dx;
                    if (board[newRow]?.[newCol]?.color === (this.color === 'WHITE' ? 'BLACK' : 'WHITE')) {
                        moves.push([newRow, newCol]);
                    }
                });
                break;

            case 'ROOK':
                // Horizontal and vertical moves
                [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
                    let newRow = row + dx;
                    let newCol = col + dy;
                    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (board[newRow][newCol] === null) {
                            moves.push([newRow, newCol]);
                        } else if (board[newRow][newCol].color !== this.color) {
                            moves.push([newRow, newCol]);
                            break;
                        } else {
                            break;
                        }
                        newRow += dx;
                        newCol += dy;
                    }
                });
                break;

            case 'KNIGHT':
                [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (board[newRow][newCol] === null || board[newRow][newCol].color !== this.color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                });
                break;

            case 'BISHOP':
                // Diagonal moves
                [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dx, dy]) => {
                    let newRow = row + dx;
                    let newCol = col + dy;
                    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (board[newRow][newCol] === null) {
                            moves.push([newRow, newCol]);
                        } else if (board[newRow][newCol].color !== this.color) {
                            moves.push([newRow, newCol]);
                            break;
                        } else {
                            break;
                        }
                        newRow += dx;
                        newCol += dy;
                    }
                });
                break;

            case 'QUEEN':
                // Combine rook and bishop moves
                [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dx, dy]) => {
                    let newRow = row + dx;
                    let newCol = col + dy;
                    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (board[newRow][newCol] === null) {
                            moves.push([newRow, newCol]);
                        } else if (board[newRow][newCol].color !== this.color) {
                            moves.push([newRow, newCol]);
                            break;
                        } else {
                            break;
                        }
                        newRow += dx;
                        newCol += dy;
                    }
                });
                break;

            case 'KING':
                // One square in any direction
                [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        if (board[newRow][newCol] === null || board[newRow][newCol].color !== this.color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                });
                break;
        }

        return moves;
    }
}