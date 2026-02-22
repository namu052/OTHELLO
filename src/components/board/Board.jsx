import { STONE } from '../../features/othello/types/constants.js';
import './board.css';
import Cell from './Cell.jsx';

function Board({ board, validMoves, onCellClick }) {
  const validMoveSet = new Set(validMoves.map(({ row, col }) => `${row}-${col}`));

  if (!board || board.length === 0) {
    return null;
  }

  return (
    <section aria-label="othello board" className="board">
      {board.map((rowItems, rowIndex) =>
        rowItems.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            isValidMove={validMoveSet.has(`${rowIndex}-${colIndex}`)}
            row={rowIndex}
            col={colIndex}
            stone={cell ?? STONE.EMPTY}
            onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
          />
        )),
      )}
    </section>
  );
}

export default Board;
