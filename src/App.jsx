import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// Komponent od wyświetlania wyniku w prawym górnym rogu max 20 pozycji różne style dla różnych clearów
function ScorePanel({ score, log }) {
    const LABELS = { 1: 'Single', 2: 'Double', 3: 'Triple', 4: 'Tetris!' }
    const CLASSES = { 1: 'tetris', 2: 'tetris', 3: 'tetris', 4: 'tetris' }
    const COLORS = { 1: '#888780', 2: '#1D9E75', 3: '#378ADD', 4: '#7F77DD' }
    const SIZES =  { 1: 10, 2: 20, 3: 27, 4: 35 }

    return (
      <div style={{ width: 160, fontFamily: 'sans-serif', paddingTop: 8 }}>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>score</div>
        <div style={{ fontSize: 52, fontWeight: 500, lineHeight: 1, letterSpacing: -2 }}>{score}</div>
        <hr style={{ border: 'none', borderTop: '0.5px solid #ccc', margin: '12px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {log.map(entry => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}
            className={entry.rows >= 4 ? "tetris" : ""}>
              <span style={{ fontSize: SIZES[entry.rows], fontWeight: entry.rows >= 3 ? 500 : 400, color: COLORS[entry.rows] }}>
                {LABELS[entry.rows] ?? `${entry.rows} rows`}
              </span>
              <span style={{ fontSize: 12, color: '#aaa' }}>+{entry.pts}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

function App() {
  // tworzenie pustej tablicy 2d 10 na 20
    const createBoard = () =>
      Array.from({ length: 20 }, () => Array(10).fill(0));
  const [board, setBoard] = useState(createBoard());
  const [staticBoard, setStaticBoard] = useState(createBoard());
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreLog, setScoreLog] = useState([])
  const scoreIdRef = useRef(0)
  const COLORS = {
    0: "black",
    1: "cyan",
    2: "yellow",
    3: "purple",
    4: "orange",
    5: "blue",
    6: "green",
    7: "red"
  };
  const shapes = {
    square: [
      [1,1],
      [1,1]
    ],
    long: [
      [1],
      [1],
      [1],
      [1]
    ],
    El: [
      [1,0],
      [1,0],
      [1,1]
    ],
    Wa: [
      [0,1],
      [0,1],
      [1,1]
    ],
    T: [
      [0,1,0],
      [1,1,1]
    ],
    Snake: [
      [1,0],
      [1,1],
      [0,1]
    ],
    Znake:[
      [0,1],
      [1,1],
      [1,0]
    ]
  }
// Obrót matrycy o 90 stopni w prawo x=y y=n-x-1
  const RotateMatrix = (shape) =>{
    if(shape.length==shape[0].length){
      return shape
    }
    let newshape = Array.from({ length: shape[0].length }, () => Array(shape.length).fill(0));
    const n = shape.length
    for(let i = 0; i < shape.length; i++){
      for(let j =0; j< shape[0].length;j++){
        newshape[j][n-i-1] = shape[i][j]
      }
    }
    console.log(newshape)

    return newshape
  }
// nowy kształt plus losowy kolor
  function newPiece(currentStatic){
    const keys = Object.keys(shapes)
    let shape2 = shapes[keys[Math.floor(Math.random()*keys.length)]]
    let color = Math.floor(Math.random()*6)+1
    let newshape = Array.from({ length: shape2.length }, () => Array(shape2[0].length).fill(0));
    for(let i = 0; i < shape2.length; i++){
      for(let j =0; j< shape2[0].length;j++){
        if(shape2[i][j]!=0)newshape[i][j] = color
      }
    }
    for(let a = 0; a <currentStatic[0].length;a++){
      for(let i = 0; i < newshape.length; i++){
        for(let j = 0; j < newshape[0].length; j++){
          if(newshape[i][j] != 0 && currentStatic[0][a] != 0){
            setGameOver(true); return;
          }
        }
      }
    }
    setCurShape(newshape)
    setX(0)
    setY(4)
  }

  const SCORE_TABLE = { 1: 100, 2: 300, 3: 500, 4: 800 }
  const SCORE_LABELS = { 1: 'single', 2: 'double', 3: 'triple', 4: 'tetris!' }
// faktyczne dodawanie pozycji do licznika 
  function addScore(rows) {
    const pts = SCORE_TABLE[rows] || rows * 100
    setScore(prev => prev + pts)
    setScoreLog(prev => [{ rows, pts, id: scoreIdRef.current++ }, ...prev].slice(0, 20))
  }


// czyszczenie tablicy po ustawieniu rządka
  function clearRows(board){
    let completed = []
    let funkyvariable =0
    const newBoard = board.map(row => [...row]);

    for(let i =0; i<board.length; i++){
      let fullrow = true;
      for(let j =0; j<board[0].length;j++){
        if(board[i][j]==0){fullrow=false;break}
      }
      fullrow? completed[i]=1: completed[i]=0
    }
    
    
    for(let i = newBoard.length - 1; i >= 0; i--){
      let fullrow = true
      for(let k = 0; k < newBoard[0].length; k++){
        if(newBoard[i][k] == 0){ fullrow = false; break }
      }
      if(fullrow){
        funkyvariable++
        for(let j = i; j > 0; j--){
          for(let k = 0; k < newBoard[0].length; k++){
            newBoard[j][k] = newBoard[j-1][k]
          }
        }
        for(let k = 0; k < newBoard[0].length; k++){
          newBoard[0][k] = 0
        }
        i++
      }
    }
  return { board: funkyvariable > 0 ? newBoard : board, cleared: funkyvariable }
  }
// reset gry na przegraną
  function loose() {
    setGameOver(true)
    setScore(0)
    setScoreLog([])
    addScore()
  }
// aktualizacja tablicy po współ x y i obecnym kształcie sprawdza kolizje z ścianami bocznymi ale nie podłogą
 function updateBoard(x,y,shape) {
  // kolizja ściany
    if(19<x+shape.length-1 || 9<y+shape[0].length-1)return board
  // przesunięcie
    setBoard(() => {
      const newBoard = staticBoard.map(row => [...row]);
      for(let i = 0;i<shape.length;i++){
        for(let j =0;j<shape[0].length;j++){
          if(shape[i][j]!=0){
            newBoard[x+i][y+j]= shape[i][j]
          }
        }
      }
      // // kolizja podłoga
      // if(x==20-shape.length){
      //   console.log("BANG")
      //   setStaticBoard(newBoard)
      //   const { board: cleared, cleared: rowsCleared } = clearRows(newBoard)
      //   if (rowsCleared > 0) addScore(rowsCleared)
      //   for(let i =0;i<cleared[0].length;i++){
      //     if(cleared[0][i]!=0){
      //       setGameOver(true)
      //       console.log("ending")
      //       break
      //     }
      //   }
      //   setStaticBoard(cleared)
      //   newPiece(cleared)
      //   return newBoard
      // }
      
      return newBoard;
    });
  }

    const [x,setX] = useState(0)
    const [y,setY] = useState(4)
    const [curShape, setCurShape] = useState(shapes["long"])
// Hook aktualizujący gre przy zmianie kształtu lub współ kstzałtu
    useEffect(() => {
      if (gameOver) return;
      updateBoard(x,y,curShape);
    }, [x,y,curShape]);
// system inputu plus kolizja z podłoga z ślizganiem
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (gameOver) return;
        const shapeWidth = curShape[0].length;
        const shapeHeight = curShape.length;
        let newX = x;
        let newY = y;
        let input = -1
//  strzałka lewo
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          newY = y - 1;
          input=1
//  strzałka prawo
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          newY = y + 1;
          input =2
//  strzałka góra
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const rotated = RotateMatrix(curShape)
          const newWidth = rotated[0].length
          const clampedY = Math.min(y, 9 - newWidth + 1)
          setY(clampedY)
          setCurShape(rotated)
//  strzałka dół i wiadomo kolizja podłoga/statyczne elementy
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          newX = x+1
          let kurczeKłopot = false
          for(let i = 0; i < curShape.length;i++){
            for(let j =0; j<curShape[0].length;j++){
              if(curShape[i][j]!=0 && staticBoard[newX+i][y+j]!= 0){kurczeKłopot = true;break}
            }
          }
          if(kurczeKłopot){
            const newStatic = staticBoard.map(row => [...row]);
            for(let i = 0; i < curShape.length; i++){
              for(let j = 0; j < curShape[0].length; j++){
                if(curShape[i][j] !== 0){
                  newStatic[x + i][y + j] = curShape[i][j];
                }
              }
            }
            const { board: cleared, cleared: rowsCleared } = clearRows(newStatic)
            if (rowsCleared > 0) addScore(rowsCleared)

            setStaticBoard(cleared); 

            console.log("BANG")
            console.log(board)
            newPiece(cleared)
            return
          }

          if(x+shapeHeight <=19){setX(x+1)}
        }
        for(let i = 0; i < curShape.length;i++){
          for(let j =0; j<curShape[0].length;j++){
            if(curShape[i][j]!=0 && staticBoard[x+i][newY+j]!= 0)return
          }
        }
        if(input == 1){if(y>0){setY(y-1)}}
        if(input == 2){if(y+shapeWidth <= 9){setY(y+1)}}
        
        
        
        console.log(x+"john"+y)
      };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    }, [x,y,curShape]);

// "gravitacja" ściąganie kostki w dół
    useEffect(() => {
      if (gameOver) return;

      const interval = setInterval(() => {
        const newX = x + 1;
        let collision = false;
// wykrywanie kolizji
        for (let i = 0; i < curShape.length; i++) {
          for (let j = 0; j < curShape[0].length; j++) {
            if (curShape[i][j] !== 0) {
              if (newX + i > 19 || staticBoard[newX + i][y + j] !== 0) {
                collision = true;
                break;
              }
            }
          }
          if (collision) break;
        }
// aktualizacja statica kształtu itd przy kolizji
        if (collision) {
          const newStatic = staticBoard.map(row => [...row]);
          for (let i = 0; i < curShape.length; i++) {
            for (let j = 0; j < curShape[0].length; j++) {
              if (curShape[i][j] !== 0) {
                newStatic[x + i][y + j] = curShape[i][j];
              }
            }
          }
          const { board: cleared, cleared: rowsCleared } = clearRows(newStatic);
          if (rowsCleared > 0) addScore(rowsCleared);
          setStaticBoard(cleared);
          newPiece(cleared);
        } else {
          setX(newX);
        }
      }, 500);

      return () => clearInterval(interval);
    }, [x, y, curShape, staticBoard, gameOver]);

  


  return (
    <>
      <section id='mainSec'>
        {/* game over wyświetlany przy przegranej */}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: '#E24B4A', letterSpacing: -2, lineHeight: 1 }}>
            GAME OVER
          </div>
          <div style={{ fontSize: 28, color: 'white', margin: '12px 0 24px' }}>
            score: {score}
          </div>
          <button onClick={() => {
            const newone = createBoard()
            setBoard(newone)
            setStaticBoard(newone)
            setGameOver(false)
            setScore(0)
            setScoreLog([])
            newPiece(newone)
          }} style={{
            fontSize: 18,
            padding: '10px 32px',
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: 8,
            cursor: 'pointer'
          }}>
            restart
          </button>
        </div>
      )}
      {/* główna plansza */}
        <table>
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      backgroundColor: COLORS[cell],
                      width: 40,
                      height: 40,
                      border: "1px solid #f00"
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* komponent tablicy punktów */}
        <ScorePanel score={score} log={scoreLog} />
      </section>
    </>
  )
}

export default App
