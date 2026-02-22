import { useReducer } from 'react';
import { gameReducer } from '../state/game-reducer.js';
import { initialGameState } from '../state/initial-state.js';

export function useOthelloGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const actions = {
    placeStone: (move) => dispatch({ type: 'PLACE_STONE', payload: move }),
    passTurn: () => dispatch({ type: 'PASS_TURN' }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
  };

  return { state, dispatch, actions };
}
