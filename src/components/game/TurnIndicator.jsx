import { STONE } from '../../features/othello/types/constants.js';

function TurnIndicator({ currentPlayer }) {
  const playerText = currentPlayer === STONE.BLACK ? '흑' : '백';

  return (
    <section>
      <h2>현재 턴</h2>
      <p>{playerText}</p>
    </section>
  );
}

export default TurnIndicator;
