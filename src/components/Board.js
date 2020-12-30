import React, { useEffect, useState } from "react";
import Square from "./Square";

// import "./board.styles.css";
import "../App.css";

const Board = ({
  boardFields,
  prevBoardFields,
  shadowBoardFields,
  points,
  reset,
}) => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    makeBoard(boardFields);
  }, [boardFields]);

  useEffect(() => {
    makeBoard(shadowBoardFields);
  }, [shadowBoardFields]);

  //////////// MAKE BOARD ///////////////////////////////

  const makeBoard = (boardFields) => {
    const fields = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let classes = `board-'borders'
        ${prevBoardFields.current[i][j] === 3 && " transition "}
        ${boardFields[i][j] === 3 && "square-lighter"} ${
          boardFields[i][j] === 2 && "shadow"
        } `;

        if (
          ((i < 3 || i > 5) && (j < 3 || j > 5)) ||
          (i > 2 && i < 6 && j > 2 && j < 6)
        ) {
          classes += !boardFields[i][j] && "empty-dark";
        } else {
          classes += !boardFields[i][j] && "empty";
        }

        fields.push(
          <Square key={`${i}-${j}`} id={`${i}-${j}`} classes={classes}></Square>
        );
      }
    }
    setBoard(fields);
  };

  /////////////////////////////////////////////////////////////////

  return (
    <div className="board">
      {board}

      <span id="points" className="position points">
        {points}
      </span>
      <div className="game_over-box position">
        <span id="game_over" className="game_over">
          Game Over!
        </span>
        <button className="reset-button" onClick={() => reset()}>
          Play again
        </button>
      </div>
    </div>
  );
};

export default Board;
