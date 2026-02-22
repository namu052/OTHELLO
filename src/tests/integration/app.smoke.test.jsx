import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../app/App.jsx';

describe('App integration', () => {
  it('renders initial state', () => {
    render(<App />);
    expect(screen.getByText('Othello')).toBeInTheDocument();
    expect(screen.getByText('현재 턴')).toBeInTheDocument();
    expect(screen.getByText('흑: 2')).toBeInTheDocument();
    expect(screen.getByText('백: 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '패스' })).toBeDisabled();
  });

  it('updates board/score/turn when user makes a valid move', () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText('board cell 2-3'));

    expect(screen.getByText('흑: 4')).toBeInTheDocument();
    expect(screen.getByText('백: 1')).toBeInTheDocument();
    expect(screen.getByText('백')).toBeInTheDocument();
  });

  it('ignores invalid move clicks', () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText('board cell 0-0'));

    expect(screen.getByText('흑: 2')).toBeInTheDocument();
    expect(screen.getByText('백: 2')).toBeInTheDocument();
  });

  it('resets game state when reset button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText('board cell 2-3'));
    fireEvent.click(screen.getByRole('button', { name: '새 게임' }));

    expect(screen.getByText('흑: 2')).toBeInTheDocument();
    expect(screen.getByText('백: 2')).toBeInTheDocument();
    expect(screen.getByText('유효 수: 4')).toBeInTheDocument();
  });
});
