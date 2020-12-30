import { SHAPES } from "../fixtures/shapes";

//////////// CHECK BOARD //////////////////////////////////

export const checkBoard = (boardFields, value = []) => {
  const fields = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const erase = {
    rows: [],
    columns: [],
    squares: [],
  };
  let x = 0;
  let y = 0;
  let square = 0;

  for (let i = 0; i < 9; i++) {
    y = 0;
    x = 0;
    for (let j = 0; j < 9; j++) {
      y += boardFields[i][j] ? 1 : 0;
      x += boardFields[j][i] ? 1 : 0;
    }
    if (y === 9) {
      erase.rows.push(i);
    }
    if (x === 9) {
      erase.columns.push(i);
    }
  }

  for (let k = 0; k < 9; k += 3) {
    for (let i = 0; i < 9; i++) {
      for (let j = k; j < k + 3; j++) {
        square += boardFields[i][j] ? 1 : 0;
      }

      if ((i + 1) % 3 === 0) {
        if (square === 9) {
          erase.squares.push([i - 2, k]);
        }
        square = 0;
      }
    }
  }

  erase.rows.forEach((row) => {
    for (let j = 0; j < 9; j++) {
      fields[row][j] = 1;
    }
  });

  erase.columns.forEach((col) => {
    for (let j = 0; j < 9; j++) {
      fields[j][col] = 1;
    }
  });

  erase.squares.forEach((square) => {
    let [x, y] = square;

    for (let i = x; i < x + 3; i++) {
      for (let j = y; j < y + 3; j++) {
        fields[i][j] = 1;
      }
    }
  });

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      fields[i][j] = fields[i][j] === 1 ? value : boardFields[i][j];
    }
  }

  let sum = erase.rows.length + erase.columns.length + erase.squares.length;

  return { fields, sum };
};

///////////////////////////////////////////////////////////

//////////// CHECK IS GAME OVER ///////////////////////////

export const isGameOver = (boardFields, shapesInfo) => {
  shapesInfo = shapesInfo.filter((shape) => !shape.hide);

  let gameOver = false;

  if (shapesInfo.length === 0) {
    return false;
  }

  for (let index = 0; index < shapesInfo.length; index++) {
    const { random, columnsLength, rowsLength } = shapesInfo[index];

    let shape = SHAPES[random];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        gameOver = false;
        if (i + (rowsLength - 1) > 8 || j + (columnsLength - 1) > 8) {
          break;
        }

        for (let k = 0; k < rowsLength; k++) {
          for (let l = 0; l < columnsLength; l++) {
            if (boardFields[i + k][j + l] === 1 && shape[k][l] === 1) {
              gameOver = true;
              break;
            }
          }
          if (gameOver) break;
        }
        if (!gameOver) {
          return false;
        }
      }
    }
  }

  return true;
};

///////////////////////////////////////////////////////////

///////////////////////// PICK SHAPE ////////////////////////////

export const pickShapes = () => {
  const shapes = [];

  for (let k = 0; k < 3; k++) {
    const random = Math.floor(1 + Math.random() * Object.keys(SHAPES).length);

    const newShape = {
      random,
      rowsLength: SHAPES[random].length,
      columnsLength: SHAPES[random][0].length,
      hide: "",
    };

    shapes.push({ ...newShape });
  }

  return shapes;
};

///////////////////////////////////////////////////////////////////////////
