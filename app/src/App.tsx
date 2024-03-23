import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const GAME_PANEL_WIDTH = 10;
const GAME_PANEL_HEIGHT = 20;

type GamePanelCell = {
  isBlock: boolean,
  color: string,
}

type GamePanel = {
  table: GamePanelCell[][],
}

type Position = {
  x: number,
  y: number,
}

type Tetrimino = {
  mino: boolean[][],
  color: string, // テトリミノの色
  p: Position,
}

const TETRIMINO_TYPES: { [key: string]: Tetrimino } = {
  'I': {
    mino: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
    ],
    color: 'lightblue',
    p: { x: 3, y: -3 },
  },
  'O': {
    mino: [
      [true, true],
      [true, true],
    ],
    color: 'yellow',
    p: { x: 4, y: -2 },
  },
  'S': {
    mino: [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
    color: 'green',
    p: { x: 3, y: -2 },
  },
  'Z': {
    mino: [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
    color: 'red',
    p: { x: 3, y: -2 },
  },
  'J': {
    mino: [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
    color: 'darkblue',
    p: { x: 3, y: -2 },
  },
  'L': {
    mino: [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
    color: 'orange',
    p: { x: 3, y: -2 },
  },
  'T': {
    mino: [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
    color: 'purple',
    p: { x: 3, y: -2 },
  },
}

function copyTetrimino(tetrimino: Tetrimino): Tetrimino {
  const copiedTetrimino: Tetrimino = { ...tetrimino };
  copiedTetrimino.mino = copiedTetrimino.mino.map(a => a.map(b => b));
  copiedTetrimino.p = { ...copiedTetrimino.p };
  return copiedTetrimino;
}

function rotateTetrimino(tetrimino: Tetrimino, clockwise: boolean): Tetrimino {
  const newTetrimino: Tetrimino = copyTetrimino(tetrimino);
  const yy = Object.keys(newTetrimino.mino);
  const xx = Object.keys(newTetrimino.mino[0]);
  if (clockwise) {
    xx.reverse();
  } else {
    yy.reverse();
  }
  newTetrimino.mino = xx.map(x => yy.map(y => newTetrimino.mino[Number(x)][Number(y)]));
  return newTetrimino;
}

function fallTetrimino(tetrimino: Tetrimino): Tetrimino {
  const newTetrimino: Tetrimino = copyTetrimino(tetrimino);
  newTetrimino.p.y++;
  return newTetrimino;
}

function leftTetrimino(tetrimino: Tetrimino): Tetrimino {
  const newTetrimino: Tetrimino = copyTetrimino(tetrimino);
  newTetrimino.p.x--;
  return newTetrimino;
}

function rightTetrimino(tetrimino: Tetrimino): Tetrimino {
  const newTetrimino: Tetrimino = copyTetrimino(tetrimino);
  newTetrimino.p.x++;
  return newTetrimino;
}

function shuffle(arr: any) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = arr[--i];

    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function conflictTetrimino(gamePanel: GamePanel, tetrimino: Tetrimino): boolean {
  return false;
}

function mergeTetrimino(gamePanel: GamePanel, tetrimino: Tetrimino): GamePanel {
  const copiedGamePanel = {
    table: gamePanel.table.map(a => a.map(b => {
      return { ...b };
    }))
  };
  tetrimino.mino.forEach((a, dy) => a.map((isBlock, dx) => {
    const x = tetrimino.p.x + dx;
    const y = tetrimino.p.y + dy;
    if (isBlock && 0 <= x && x < GAME_PANEL_WIDTH && 0 <= y && y < GAME_PANEL_HEIGHT) {
      copiedGamePanel.table[y][x] = {
        isBlock: true,
        color: tetrimino.color,
      };
    }
  }));
  return copiedGamePanel;
}

function App() {
  // 座標は左上が原点、1次元目縦20マス、2次元目横10マス
  const [orgGamePanel, setGamePanel] = useState<GamePanel>({
    table: [...Array(GAME_PANEL_HEIGHT)].map(j => [...Array(GAME_PANEL_WIDTH)].map(k => {
      return { 'isBlock': false, 'color': 'gray' };
    }))
  });
  const gamePanel = useRef<GamePanel>(orgGamePanel);
  useEffect(() => {
    gamePanel.current = orgGamePanel;
  }, [orgGamePanel]);

  // 表示用のゲームパネル（固定ブロックが置かれたゲームパネル＋テトリミノ）
  const [orgGamePanelView, setGamePanelView] = useState<GamePanel>({
    table: [...Array(GAME_PANEL_HEIGHT)].map(j => [...Array(GAME_PANEL_WIDTH)].map(k => {
      return { 'isBlock': false, 'color': 'gray' };
    }))
  });
  const gamePanelView = useRef<GamePanel>(orgGamePanelView);
  useEffect(() => {
    gamePanelView.current = orgGamePanelView;
  }, [orgGamePanelView]);

  // テトリミノ
  const tmpTetriminos: Tetrimino[] = [ // ランダムで2セット分用意、
    ...shuffle(Object.values(TETRIMINO_TYPES)).map((a: Tetrimino) => copyTetrimino(a)),
    ...shuffle(Object.values(TETRIMINO_TYPES)).map((a: Tetrimino) => copyTetrimino(a)),
  ];
  const [orgCurrentTetrimino, setCurrentTetrimino] = useState<Tetrimino>(tmpTetriminos[0]);
  const currentTetrimino = useRef<Tetrimino>(orgCurrentTetrimino);
  useEffect(() => {
    currentTetrimino.current = orgCurrentTetrimino;
  }, [orgCurrentTetrimino]);

  tmpTetriminos.shift();
  const [nextTetriminos, setNextTetriminos] = useState<Tetrimino[]>(tmpTetriminos);

  const [fallTimer, setFallTimer] = useState<NodeJS.Timeout | null>(null);
  const fallTimerEvent = () => {
    const tmpFallTimer = setTimeout(() => {
      fallTimerEvent();

      const falledTetrimino = fallTetrimino(currentTetrimino.current);

      if (!conflictTetrimino(gamePanel.current, falledTetrimino)) {
        setCurrentTetrimino(falledTetrimino);
        setGamePanelView(mergeTetrimino(gamePanel.current, falledTetrimino));
      }

    }, 1000);
    setFallTimer(tmpFallTimer);
    return () => clearTimeout(tmpFallTimer);
  };

  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  useEffect(() => {
    if (isGameStart) {
      fallTimerEvent();
    }
  }, [isGameStart]);

  const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.code;

    let enableKeys = false;
    let nextTetrimino = currentTetrimino.current;
    // if (key === 'ArrowUp') {
    //   enableKeys = true;
    // }
    // if (key === 'ArrowDown') {
    //   enableKeys = true;
    // }
    if (key === 'ArrowLeft') {
      enableKeys = true;
      nextTetrimino = leftTetrimino(currentTetrimino.current);
    }
    if (key === 'ArrowRight') {
      enableKeys = true;
      nextTetrimino = rightTetrimino(currentTetrimino.current);
    }
    if (key === 'Space') {
      enableKeys = true;
      if (!isGameStart) {
        setIsGameStart(true);
      }
    }

    if (enableKeys) {
      if (!conflictTetrimino(gamePanel.current, nextTetrimino)) {
        setCurrentTetrimino(nextTetrimino);
        setGamePanelView(mergeTetrimino(gamePanel.current, nextTetrimino));
      }
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
              {gamePanelView.current.table.map((row, j) => (
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
