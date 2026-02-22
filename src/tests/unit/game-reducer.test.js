import { describe, expect, it } from 'vitest';
import { gameReducer } from '../../features/othello/state/game-reducer.js';
import {
  createInitialGameState,
  initialGameState,
} from '../../features/othello/state/initial-state.js';
import { STONE } from '../../features/othello/types/constants.js';

describe('gameReducer', () => {
  it('provides a valid initial game state', () => {
    expect(initialGameState.currentPlayer).toBe(STONE.BLACK);
    expect(initialGameState.validMoves).toHaveLength(4);
    expect(initialGameState.score).toEqual({ black: 2, white: 2 });
    expect(initialGameState.gameOver).toBe(false);
    expect(initialGameState.winner).toBeNull();
  });

  it('handles PLACE_STONE for a valid move', () => {
    const state = createInitialGameState();
    const next = gameReducer(state, {
      type: 'PLACE_STONE',
      payload: { row: 2, col: 3 },
    });

    expect(next).not.toBe(state);
    expect(next.board[2][3]).toBe(STONE.BLACK);
    expect(next.board[3][3]).toBe(STONE.BLACK);
    expect(next.currentPlayer).toBe(STONE.WHITE);
    expect(next.passCount).toBe(0);
    expect(next.validMoves.length).toBeGreaterThan(0);
  });

  it('ignores PLACE_STONE for invalid move', () => {
    const state = createInitialGameState();
    const next = gameReducer(state, {
      type: 'PLACE_STONE',
      payload: { row: 0, col: 0 },
    });

    expect(next).toBe(state);
  });

  it('ignores PASS_TURN when player still has valid moves', () => {
    const state = createInitialGameState();
    const next = gameReducer(state, { type: 'PASS_TURN' });

    expect(next).toBe(state);
  });

  it('handles PASS_TURN when current player has no moves', () => {
    const board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => STONE.BLACK),
    );
    board[0][0] = STONE.EMPTY;
    board[0][1] = STONE.WHITE;
    board[0][2] = STONE.BLACK;

    const forcedPassState = {
      board,
      currentPlayer: STONE.WHITE,
      validMoves: [],
      score: { black: 62, white: 1 },
      passCount: 0,
      gameOver: false,
      winner: null,
    };

    const next = gameReducer(forcedPassState, { type: 'PASS_TURN' });
    expect(next.currentPlayer).toBe(STONE.BLACK);
    expect(next.passCount).toBe(1);
  });

  it('handles RESET_GAME', () => {
    const state = createInitialGameState();
    const progressed = gameReducer(state, {
      type: 'PLACE_STONE',
      payload: { row: 2, col: 3 },
    });

    const reset = gameReducer(progressed, { type: 'RESET_GAME' });
    expect(reset.currentPlayer).toBe(STONE.BLACK);
    expect(reset.score).toEqual({ black: 2, white: 2 });
    expect(reset.validMoves).toHaveLength(4);
    expect(reset.gameOver).toBe(false);
  });

  it('ends game when PASS_TURN occurs with no available moves for both players', () => {
    const board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => STONE.BLACK),
    );

    const terminalLikeState = {
      board,
      currentPlayer: STONE.WHITE,
      validMoves: [],
      score: { black: 64, white: 0 },
      passCount: 0,
      gameOver: false,
      winner: null,
    };

    const next = gameReducer(terminalLikeState, { type: 'PASS_TURN' });
    expect(next.gameOver).toBe(true);
    expect(next.winner).toBe(STONE.BLACK);
  });
});
