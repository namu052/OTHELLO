import { RESULT, STONE } from '../../features/othello/types/constants.js';
import './game-panel.css';
import ScoreBoard from './ScoreBoard.jsx';
import TurnIndicator from './TurnIndicator.jsx';

function getWinnerLabel(winner) {
  if (winner === STONE.BLACK) {
    return '흑 승리';
  }
  if (winner === STONE.WHITE) {
    return '백 승리';
  }
  if (winner === RESULT.DRAW) {
    return '무승부';
  }
  return '';
}

function GamePanel({
  currentPlayer,
  score,
  validMoves,
  gameOver,
  winner,
  onResetGame,
  onPassTurn,
  passCount,
}) {
  const canPass = !gameOver && validMoves.length === 0;
  const statusText = gameOver ? getWinnerLabel(winner) : '게임 진행 중';

  return (
    <aside className="game-panel">
      <TurnIndicator currentPlayer={currentPlayer} />
      <ScoreBoard score={score} />
      <section className="game-panel__status">
        <h2>상태</h2>
        <p>{statusText}</p>
        <p>유효 수: {validMoves.length}</p>
        <p>연속 패스: {passCount}</p>
      </section>
      <div className="game-panel__actions">
        <button disabled={!canPass} onClick={onPassTurn} type="button">
          패스
        </button>
        <button onClick={onResetGame} type="button">
          새 게임
        </button>
      </div>
    </aside>
  );
}

export default GamePanel;
