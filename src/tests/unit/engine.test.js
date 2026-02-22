import { describe, expect, it } from 'vitest';
import { applyMove } from '../../features/othello/engine/flipper.js';
import {
  getScore,
  getWinner,
  isBoardFull,
  isGameOver,
  shouldPassTurn,
} from '../../features/othello/engine/game-over.js';
import {
  getFlipsForMove,
  getOpponent,
  isInBounds,
  isValidMove,
} from '../../features/othello/engine/move-validator.js';
import { createInitialBoard, getValidMoves } from '../../features/othello/engine/rules.js';
import { RESULT, STONE } from '../../features/othello/types/constants.js';

function asKey(move) {
  return `${move.row},${move.col}`;
}

describe('othello engine', () => {
  it('creates the standard initial board', () => {
    const board = createInitialBoard();
    expect(board[3][3]).toBe(STONE.WHITE);
    expect(board[4][4]).toBe(STONE.WHITE);
    expect(board[3][4]).toBe(STONE.BLACK);
    expect(board[4][3]).toBe(STONE.BLACK);
  });

  it('calculates valid moves for each player on initial board', () => {
    const board = createInitialBoard();
    const blackMoves = getValidMoves(board, STONE.BLACK).map(asKey).sort();
    const whiteMoves = getValidMoves(board, STONE.WHITE).map(asKey).sort();

    expect(blackMoves).toEqual(['2,3', '3,2', '4,5', '5,4']);
    expect(whiteMoves).toEqual(['2,4', '3,5', '4,2', '5,3']);
  });

  it('validates move and returns flippable stones', () => {
    const board = createInitialBoard();
    const move = { row: 2, col: 3 };
    const flips = getFlipsForMove(board, move, STONE.BLACK);

    expect(isValidMove(board, move, STONE.BLACK)).toBe(true);
    expect(flips).toEqual([[3, 3]]);
    expect(isValidMove(board, { row: 0, col: 0 }, STONE.BLACK)).toBe(false);
  });

  it('applies move without mutating original board', () => {
    const board = createInitialBoard();
    const nextBoard = applyMove(board, { row: 2, col: 3 }, STONE.BLACK);

    expect(nextBoard).not.toBe(board);
    expect(nextBoard[2][3]).toBe(STONE.BLACK);
    expect(nextBoard[3][3]).toBe(STONE.BLACK);
    expect(board[2][3]).toBe(STONE.EMPTY);
    expect(board[3][3]).toBe(STONE.WHITE);
  });

  it('flips stones in multiple directions for one move', () => {
    const board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => STONE.EMPTY));
    board[3][4] = STONE.WHITE;
    board[3][5] = STONE.BLACK;
    board[4][3] = STONE.WHITE;
    board[5][3] = STONE.BLACK;
    board[4][4] = STONE.WHITE;
    board[5][5] = STONE.BLACK;

    const flips = getFlipsForMove(board, { row: 3, col: 3 }, STONE.BLACK);
    expect(flips).toEqual(
      expect.arrayContaining([
        [3, 4],
        [4, 3],
        [4, 4],
      ]),
    );

    const nextBoard = applyMove(board, { row: 3, col: 3 }, STONE.BLACK);
    expect(nextBoard[3][3]).toBe(STONE.BLACK);
    expect(nextBoard[3][4]).toBe(STONE.BLACK);
    expect(nextBoard[4][3]).toBe(STONE.BLACK);
    expect(nextBoard[4][4]).toBe(STONE.BLACK);
  });

  it('supports helper utilities and end-game calculations', () => {
    const board = createInitialBoard();
    const score = getScore(board);

    expect(score).toEqual({ black: 2, white: 2 });
    expect(getOpponent(STONE.BLACK)).toBe(STONE.WHITE);
    expect(isInBounds(0, 0)).toBe(true);
    expect(isInBounds(-1, 0)).toBe(false);
    expect(isBoardFull(board)).toBe(false);
    expect(isGameOver(board, STONE.BLACK, 0)).toBe(false);
  });

  it('handles pass and game over scenarios', () => {
    const fullBlackBoard = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => STONE.BLACK),
    );

    expect(shouldPassTurn(fullBlackBoard, STONE.WHITE)).toBe(true);
    expect(isBoardFull(fullBlackBoard)).toBe(true);
    expect(isGameOver(fullBlackBoard, STONE.WHITE, 0)).toBe(true);
    expect(isGameOver(createInitialBoard(), STONE.BLACK, 2)).toBe(true);
    expect(getWinner(fullBlackBoard)).toBe(STONE.BLACK);
  });

  it('returns draw winner when both counts are equal', () => {
    const drawBoard = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) =>
        (row + col) % 2 === 0 ? STONE.BLACK : STONE.WHITE,
      ),
    );

    expect(getWinner(drawBoard)).toBe(RESULT.DRAW);
  });
});
