import { getScore, getWinner, isGameOver } from '../engine/game-over.js';
import { getValidMoves } from '../engine/rules.js';
import { STONE } from '../types/constants.js';
import { createInitialBoard } from '../engine/rules.js';

export function deriveGameState(board, currentPlayer, passCount = 0) {
  const validMoves = getValidMoves(board, currentPlayer);
  const score = getScore(board);
  const gameOver = isGameOver(board, currentPlayer, passCount);
  const winner = gameOver ? getWinner(board) : null;

  return {
    board,
    currentPlayer,
    validMoves,
    score,
    passCount,
    gameOver,
    winner,
  };
}

export function createInitialGameState() {
  return deriveGameState(createInitialBoard(), STONE.BLACK, 0);
}

export const initialGameState = createInitialGameState();
