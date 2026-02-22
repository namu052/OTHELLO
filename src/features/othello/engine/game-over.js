import { RESULT, STONE } from '../types/constants.js';
import { getOpponent } from './move-validator.js';
import { getValidMoves } from './rules.js';

export function getScore(board) {
  return board.flat().reduce(
    (acc, cell) => {
      if (cell === STONE.BLACK) {
        acc.black += 1;
      } else if (cell === STONE.WHITE) {
        acc.white += 1;
      }
      return acc;
    },
    { black: 0, white: 0 },
  );
}

export function isBoardFull(board) {
  return board.flat().every((cell) => cell !== STONE.EMPTY);
}

export function shouldPassTurn(board, currentPlayer) {
  return getValidMoves(board, currentPlayer).length === 0;
}

export function isGameOver(board, currentPlayer, passCount = 0) {
  if (isBoardFull(board) || passCount >= 2) {
    return true;
  }

  const currentHasMove = getValidMoves(board, currentPlayer).length > 0;
  const opponentHasMove = getValidMoves(board, getOpponent(currentPlayer)).length > 0;

  return !currentHasMove && !opponentHasMove;
}

export function getWinner(board) {
  const { black, white } = getScore(board);
  if (black > white) {
    return STONE.BLACK;
  }
  if (white > black) {
    return STONE.WHITE;
  }
  return RESULT.DRAW;
}
