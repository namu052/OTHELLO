import { applyMove } from '../engine/flipper.js';
import { shouldPassTurn } from '../engine/game-over.js';
import { getOpponent, isValidMove } from '../engine/move-validator.js';
import { createInitialGameState, deriveGameState } from './initial-state.js';

function resolveAutoPass(stateLike) {
  if (stateLike.gameOver) {
    return stateLike;
  }

  if (!shouldPassTurn(stateLike.board, stateLike.currentPlayer)) {
    return stateLike;
  }

  const nextPlayer = getOpponent(stateLike.currentPlayer);
  const nextPassCount = stateLike.passCount + 1;
  const nextState = deriveGameState(stateLike.board, nextPlayer, nextPassCount);

  if (nextState.gameOver) {
    return nextState;
  }

  return nextState;
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'PLACE_STONE': {
      if (state.gameOver) {
        return state;
      }

      const move = action.payload;
      if (!isValidMove(state.board, move, state.currentPlayer)) {
        return state;
      }

      const nextBoard = applyMove(state.board, move, state.currentPlayer);
      const nextPlayer = getOpponent(state.currentPlayer);
      const movedState = deriveGameState(nextBoard, nextPlayer, 0);
      return resolveAutoPass(movedState);
    }
    case 'PASS_TURN': {
      if (state.gameOver) {
        return state;
      }

      if (!shouldPassTurn(state.board, state.currentPlayer)) {
        return state;
      }

      const nextPlayer = getOpponent(state.currentPlayer);
      const passedState = deriveGameState(state.board, nextPlayer, state.passCount + 1);
      return resolveAutoPass(passedState);
    }
    case 'RESET_GAME':
      return createInitialGameState();
    default:
      return state;
  }
}
