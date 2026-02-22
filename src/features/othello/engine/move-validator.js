import { BOARD_SIZE, DIRECTIONS, STONE } from '../types/constants.js';

export function getOpponent(player) {
  if (player === STONE.BLACK) {
    return STONE.WHITE;
  }
  if (player === STONE.WHITE) {
    return STONE.BLACK;
  }
  return null;
}

export function isInBounds(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getFlipsForMove(board, move, player) {
  if (!board || !move || !player) {
    return [];
  }

  const { row, col } = move;
  if (!isInBounds(row, col)) {
    return [];
  }
  if (board[row][col] !== STONE.EMPTY) {
    return [];
  }

  const opponent = getOpponent(player);
  if (!opponent) {
    return [];
  }

  const flips = [];

  for (const [dr, dc] of DIRECTIONS) {
    let r = row + dr;
    let c = col + dc;
    const candidate = [];

    while (isInBounds(r, c) && board[r][c] === opponent) {
      candidate.push([r, c]);
      r += dr;
      c += dc;
    }

    if (candidate.length === 0) {
      continue;
    }

    if (isInBounds(r, c) && board[r][c] === player) {
      flips.push(...candidate);
    }
  }

  return flips;
}

export function isValidMove(board, move, player) {
  return getFlipsForMove(board, move, player).length > 0;
}
