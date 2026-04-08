import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
    const createBoard = () =>
      Array.from({ length: 20 }, () => Array(10).fill(0));
  const [board, setBoard] = useState(createBoard());
  const [staticBoard, setStaticBoard] = useState(createBoard());
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
      // kolizja podłoga
      if(x==20-shape.length){
        console.log("BANG")
        setStaticBoard(newBoard)
        const keys = Object.keys(shapes)
        let shape2 = shapes[keys[Math.floor(Math.random()*keys.length)]]
        let color = Math.floor(Math.random()*6)+1
        let newshape = Array.from({ length: shape2.length }, () => Array(shape2[0].length).fill(0));
        for(let i = 0; i < shape2.length; i++){
          for(let j =0; j< shape2[0].length;j++){
            if(shape2[i][j]!=0)newshape[i][j] = color
          }
        }
        setCurShape(newshape)
        setX(0)
        setY(4)
        return newBoard
      }
      
      return newBoard;
    });
  }

  

    const [x,setX] = useState(0)
    const [y,setY] = useState(4)
    const [curShape, setCurShape] = useState(shapes["long"])

    useEffect(() => {
    updateBoard(x,y,curShape);
    }, [x,y,curShape]);

    useEffect(() => {
      const handleKeyPress = (e) => {
        const shapeWidth = curShape[0].length;
        const shapeHeight = curShape.length;
        let newX = x;
        let newY = y;
        let input = -1

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          newY = y - 1;
          input=1
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          newY = y + 1;
          input =2
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCurShape(RotateMatrix(curShape))
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
            setStaticBoard(newStatic); 

            console.log("BANG")
            console.log(board)
            
            const keys = Object.keys(shapes)
            let shape2 = shapes[keys[Math.floor(Math.random()*keys.length)]]
            let color = Math.floor(Math.random()*6)+1
            let newshape = Array.from({ length: shape2.length }, () => Array(shape2[0].length).fill(0));
            for(let i = 0; i < shape2.length; i++){
              for(let j =0; j< shape2[0].length;j++){
                if(shape2[i][j]!=0)newshape[i][j] = color
              }
            }
            setCurShape(newshape)
            setX(0)
            setY(4)
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
