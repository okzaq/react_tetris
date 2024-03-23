import React, { useState } from 'react';
import './App.css';

type GamePanelCell = {
  isBlock: boolean,
  color: string,
}

type GamePanel = {
  table: GamePanelCell[][],
}

type Tetrimino = {
  mino: GamePanelCell[][], // テトリミノの回転を考慮し正方形で定義
  x: Number, // 正方形で
  y: Number,
  color: string, // テトリミノの色
}

function App() {
  // 座標は左上が原点、1次元目縦20マス、2次元目横10マス
  const [gamePanel, setGamePanel] = useState<GamePanel>({
    table: [...Array(20)].map(j => [...Array(10)].map(k => {
      return { 'isBlock': false, 'color': 'gray' };
    }))
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.code;
    const prePosition = { x: position.x, y: position.y };
    const nextPosition = { x: position.x, y: position.y };

    let enableKeys = false;
    {
      // demo
      if (key === 'ArrowUp') {
        enableKeys = true;
        nextPosition.y--;
      }
      if (key === 'ArrowDown') {
        enableKeys = true;
        nextPosition.y++;
      }
      if (key === 'ArrowLeft') {
        enableKeys = true;
        nextPosition.x--;
      }
      if (key === 'ArrowRight') {
        enableKeys = true;
        nextPosition.x++;
      }
    }
    if (enableKeys) {
      setPosition(nextPosition);

      gamePanel.table[prePosition.y][prePosition.x].color = 'gray';
      gamePanel.table[nextPosition.y][nextPosition.x].color = 'blue';
      setGamePanel({ ...gamePanel });
    }
  };

  return (
    <div className="App" tabIndex={0} onKeyDown={keyDownHandler}>
      <header className="App-header">
        <p>Reactでテトリス作ってみた</p>
      </header>
      <div id="game-container">
        <div id="game-panel">
          <table>
            <tbody>
              {gamePanel.table.map((row, j) => (
                <tr className="fields-row" key={`fields-row-${j}`}>
                  {row.map((cell, k) =>
                    <td className="fields-cell"
                      key={`fields-cell-${j}-${k}`}
                      style={{ backgroundColor: cell.color }}
                    ></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="game-status"></div>
      </div>
    </div>
  );
}

export default App;
