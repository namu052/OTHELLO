function ScoreBoard({ score }) {
  return (
    <section>
      <h2>점수</h2>
      <p>흑: {score.black}</p>
      <p>백: {score.white}</p>
    </section>
  );
}

export default ScoreBoard;
