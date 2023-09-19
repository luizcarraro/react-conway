import { useState, useEffect } from 'react';

const TOTAL_ROWS = 30;
const TOTAL_COLUMNS = 30;

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value === 0 ? null : value}
    </button>
  );
}

function Board({ squares, onPlay }) {
  function handleClick(i, j) {
    const newSquares = squares.slice();
    newSquares[i][j] = '*';
    onPlay(newSquares);
  }

  return (
    <>
      {squares.map((row, rowIndex) => {
        return (
          <div className="board-row">
            {row.map((column, columnIndex) => {
              return (
                <Square
                  value={squares[rowIndex][columnIndex]}
                  onSquareClick={() => handleClick(rowIndex, columnIndex)}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [cells, setCells] = useState(
    Array.from({ length: TOTAL_ROWS }, () => Array.from({ length: TOTAL_COLUMNS }, () => 0))
  );

  const [isRunningLife, setIsRunningLife] = useState(false);

  function fillWithRandom() {
    const newSquares = cells.slice();
    for (let i = 0; i < TOTAL_ROWS; i++) {
      for (let j = 0; j < TOTAL_COLUMNS; j++) {
        newSquares[i][j] = Math.random() < 0.5 ? 0 : '*';
      }
    }
    setCells(newSquares);
  }

  function handlePlay(nextSquares) {
    setCells(nextSquares);
  }

  function trigger() {
    setIsRunningLife(setIsRunningLife => !isRunningLife);
  }

  useEffect(() => {
    console.log("🚀 ~ file: App.js:66 ~ trigger ~ isRunningLife:", isRunningLife)
    async function runLife() {
      console.log('Running life', isRunningLife)
      let newCells = cells.slice();
      // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      do {
        console.log('Step 1');
        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        newCells = killForeverAloneCells(newCells);
        // Any live cell with two or three live neighbours lives on to the next generation.
        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        console.log('Step 2');
        newCells = killOverpopulatedCells(newCells);
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        console.log('Step 3');
        newCells = reproduce(newCells);

        setCells(newCells);
        // sleeps for 1 second
        await new Promise(r => setTimeout(r, 1000));
      } while (isRunningLife);
    }

    if (isRunningLife) {
      runLife();
    }
  }, [isRunningLife]);


  return (
    <div className="game">
      <div className="game-board">
        <Board squares={cells} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => trigger()}>{isRunningLife ? 'Stop life': 'Start life'} </button>
        <button onClick={() => fillWithRandom()}>Random</button>
        <button onClick={() => setCells(Array.from({ length: TOTAL_ROWS }, () => Array.from({ length: TOTAL_COLUMNS }, () => 0)))}>Reset</button>
      </div>

    </div>
  );
}

function killForeverAloneCells(cells) {
  // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  const newCells = cells.slice();
  for (let i = 0; i < TOTAL_ROWS; i++) {
    for (let j = 0; j < TOTAL_COLUMNS; j++) {
      const neighbours = getNeighbours(i, j, cells);
      if (cells[i][j] === '*' && neighbours < 2) {
        newCells[i][j] = 0;
      }
    }
  }
  return newCells;
}

function killOverpopulatedCells(cells) {
  // Any live cell with more than three live neighbours dies, as if by overpopulation.
  const newCells = cells.slice();
  for (let i = 0; i < TOTAL_ROWS; i++) {
    for (let j = 0; j < TOTAL_COLUMNS; j++) {
      const neighbours = getNeighbours(i, j, cells);
      if (cells[i][j] === '*' && neighbours > 3) {
        newCells[i][j] = 0;
      }
    }
  }
  return newCells;
}

function reproduce(cells) {
  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  const newCells = cells.slice();
  for (let i = 0; i < TOTAL_ROWS; i++) {
    for (let j = 0; j < TOTAL_COLUMNS; j++) {
      const neighbours = getNeighbours(i, j, cells);
      if (cells[i][j] === 0 && neighbours === 3) {
        newCells[i][j] = '*';
      }
    }
  }
  return newCells;
}

function getNeighbours(i, j, cells) {
  let neighbours = 0;
  if (i > 0 && j > 0 && cells[i - 1][j - 1] === '*') {
    neighbours++;
  }
  if (i > 0 && cells[i - 1][j] === '*') {
    neighbours++;
  }
  if (i > 0 && j < TOTAL_COLUMNS - 1 && cells[i - 1][j + 1] === '*') {
    neighbours++;
  }
  if (j > 0 && cells[i][j - 1] === '*') {
    neighbours++;
  }
  if (j < TOTAL_COLUMNS - 1 && cells[i][j + 1] === '*') {
    neighbours++;
  }
  if (i < TOTAL_ROWS - 1 && j > 0 && cells[i + 1][j - 1] === '*') {
    neighbours++;
  }
  if (i < TOTAL_ROWS - 1 && cells[i + 1][j] === '*') {
    neighbours++;
  }
  if (i < TOTAL_ROWS - 1 && j < TOTAL_COLUMNS - 1 && cells[i + 1][j + 1] === '*') {
    neighbours++;
  }
  return neighbours;
}
