import { BOARD_SIZE, STONE } from '../types/constants.js';
import { isValidMove } from './move-validator.js';

export function createInitialBoard() {
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => STONE.EMPTY),
  );

  const mid = BOARD_SIZE / 2;
  board[mid - 1][mid - 1] = STONE.WHITE;
  board[mid][mid] = STONE.WHITE;
  board[mid - 1][mid] = STONE.BLACK;
  board[mid][mid - 1] = STONE.BLACK;

  return board;
}

export function getValidMoves(board, player) {
  const moves = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const move = { row, col };
      if (isValidMove(board, move, player)) {
        moves.push(move);
      }
    }
  }

  return moves;
}
