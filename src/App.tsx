import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import MyButton from "./UI/MyButton";

const Bomb = -1;

function CreateField(size: number): number[] {
  const field: number[] = new Array(size*size).fill(0)

  function increment(coordX: number, coordY: number) {
    if(coordX >= 0 && coordX < size && coordY >= 0 && coordY < size) {
      if(field[coordY * size + coordX] === Bomb) return;
      field[coordY * size + coordX]++;
    }
  }

  for(let i = 0; i < size;) {
    const coordX = Math.floor(Math.random() * size)
    const coordY = Math.floor(Math.random() * size)

    if(field[coordY * size + coordX] === Bomb) continue;
    field[coordY * size + coordX] = Bomb;
    i++;

    increment(coordX+1, coordY);
    increment(coordX-1, coordY);
    increment(coordX, coordY+1);
    increment(coordX, coordY-1);
    increment(coordX+1, coordY+1);
    increment(coordX+1, coordY-1);
    increment(coordX-1, coordY+1);
    increment(coordX-1, coordY-1);
  }
  return field;
}

enum Mask {
  Transparent,
  Fill,
  Flag,
  Question
}

const mapMaskToView: Record<Mask, React.ReactNode> = {
  [Mask.Transparent]: null,
  [Mask.Fill]: "🌲",
  [Mask.Flag]: "🚩",
  [Mask.Question]: "🌚",
}

function App() {

  const [size, setSize] = useState(8)
  const dimension = new Array(size).fill(null);

  const [field, setField] = useState<number[]>(() => CreateField(size))
  const [mask, setMask] = useState<Mask[]>(() => new Array(size*size).fill(Mask.Fill));
  const [death, setDeath] = useState(false)

  const win = useMemo(() =>
      !field.some(
          (f, i) =>
              f === Bomb && mask[i] !== Mask.Flag
              && mask[i] !== Mask.Transparent),
      [field, mask]);

  const setEasy = () => {
      setSize(8)
      setField(CreateField(8))
      setMask(new Array(8*8).fill(Mask.Fill))
  }
  const setMedium = () => {
      setSize(10);
      setField(CreateField(10))
      setMask(new Array(10*10).fill(Mask.Fill))
  }
  const setHard = () => {
      setSize(15);
      setField(CreateField(15))
      setMask(new Array(15*15).fill(Mask.Fill))
  }


  return (
    <div>
      <div className="ButtonPos">
        <MyButton onClick={() => setEasy()}>EASY</MyButton>
        <MyButton onClick={() => setMedium()}>MEDIUM</MyButton>
        <MyButton onClick={() => setHard()}>HARD</MyButton>
      </div>
      <div className="App">
      <div className="Game">
        <MyButton onClick={() => window.location.reload()}>RESTART</MyButton>

      {dimension.map((_, y) => {
        return (<div key={y} style={{display:"flex"}}>
              {dimension.map((_, x) => {
                return (<div
                    className="FieldsX"
                    key={x}
                    style={{
                      backgroundColor: death ? "#FAA" : win ? "#FFB" : "#BEB",
                    }}
                    onClick={() => {
                      if(win || death) return;

                      if(mask[y * size + x] === Mask.Transparent) return;
                      const clearing: [number, number][] = [];

                      function clear(x: number, y: number) {
                        if (x >= 0 && x < size && y >= 0 && y < size) {
                          if(mask[y * size + x] === Mask.Transparent) return;

                          clearing.push([x, y]);
                        }
                      }
                      clear(x, y);

                      while(clearing.length) {
                        const[x, y] = clearing.pop()!!;

                        mask[y * size + x] = Mask.Transparent;

                        if(field[y * size + x] !== 0) continue;

                        clear(x + 1, y);
                        clear(x - 1, y);
                        clear(x, y + 1);
                        clear(x, y - 1)
                      }

                      if(field[y * size + x] === Bomb) {
                        mask.forEach((_, i) => mask[i] = Mask.Transparent);
                        setDeath(true)
                      }

                      setMask((prev) => [...prev]);
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      if(win || death) return;

                      if(mask[y * size + x] === Mask.Transparent) return;

                      if(mask[y * size + x] === Mask.Fill) {
                        mask[y * size + x] = Mask.Flag;
                      } else if(mask[y * size + x] === Mask.Flag) {
                        mask[y * size + x] = Mask.Question;
                      }
                      else if(mask[y * size + x] === Mask.Question) {
                        mask[y * size + x] = Mask.Fill;
                      }
                      setMask((prev) => [...prev]);
                    }}
                    >
                  {mask[y * size + x] !== Mask.Transparent
                      ? mapMaskToView[mask[y * size + x]] : field[y * size + x] === Bomb ? "💣" : field[y * size + x]}
                </div>);
              })}
        </div>);
      })}
        </div>
      </div>
    </div>
  );
}

export default App;
