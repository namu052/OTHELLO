import { STONE } from '../../features/othello/types/constants.js';

function Cell({ stone, isValidMove, onClick, row, col }) {
  const hasStone = stone === STONE.BLACK || stone === STONE.WHITE;
  const stoneClassName = stone === STONE.BLACK ? 'stone stone--black' : 'stone stone--white';

  return (
    <button
      aria-label={`board cell ${row}-${col}`}
      className={`cell ${isValidMove ? 'cell--valid' : ''}`}
      onClick={onClick}
      type="button"
    >
      {hasStone ? <span className={stoneClassName} /> : null}
      {!hasStone && isValidMove ? <span className="cell__hint" /> : null}
    </button>
  );
}

export default Cell;
