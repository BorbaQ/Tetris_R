import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
    const createBoard = () =>
      Array.from({ length: 20 }, () => Array(10).fill(0));
  const [board, setBoard] = useState(createBoard());
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

  const rotateMatrix = (shape) =>{
    if(shape.length==shape[0].length){
      return
    }
    newshape = Array.from({ length: shape[0].length }, () => Array(shape.length).fill(0));
    for(let i = 0; i < shape.length; i++){
      for(let j =0; j< shape[0].length;j++){

      }
    }
  }






  return (
    <>
      <section id='mainSec'>
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
      </section>
    </>
  )
}

export default App
