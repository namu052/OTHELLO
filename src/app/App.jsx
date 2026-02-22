import Board from '../components/board/Board.jsx';
import GamePanel from '../components/game/GamePanel.jsx';
import { useOthelloGame } from '../features/othello/hooks/useOthelloGame.js';

function App() {
  const { state, actions } = useOthelloGame();

  return (
    <main className="app">
      <h1>Othello</h1>
      <section className="app__layout">
        <Board board={state.board} onCellClick={actions.placeStone} validMoves={state.validMoves} />
        <GamePanel
          currentPlayer={state.currentPlayer}
          gameOver={state.gameOver}
          onPassTurn={actions.passTurn}
          onResetGame={actions.resetGame}
          passCount={state.passCount}
          score={state.score}
          validMoves={state.validMoves}
          winner={state.winner}
        />
      </section>
    </main>
  );
}

export default App;
