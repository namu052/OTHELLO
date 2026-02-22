import { getFlipsForMove } from './move-validator.js';

export function applyMove(board, move, player) {
  const flips = getFlipsForMove(board, move, player);
  if (flips.length === 0) {
    return board;
  }

  const nextBoard = board.map((row) => [...row]);
  nextBoard[move.row][move.col] = player;

  for (const [row, col] of flips) {
    nextBoard[row][col] = player;
  }

  return nextBoard;
}
