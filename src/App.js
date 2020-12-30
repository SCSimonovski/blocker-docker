import React, { useState, useEffect, useRef } from "react";

import { Howl } from "howler";
import soundOne from "./audio/points-1.mp3";
import soundTwo from "./audio/points-2.mp3";
import soundThree from "./audio/points-3.mp3";
import click from "./audio/click.mp3";
import gameOverSound from "./audio/game-over-sound.mp3";

import Board from "./components/Board";
import Shapes from "./components/Shapes";

import { SHAPES } from "./fixtures/shapes";
import { checkBoard, isGameOver, pickShapes } from "./utils/utils";

import "./App.css";

function App() {
  const [shapesInfo, setShapesInfo] = useState([
    {
      hide: "",
      random: 0,
      columnsLength: 0,
      rowsLength: 0,
    },
    {
      hide: "",
      random: 0,
      columnsLength: 0,
      rowsLength: 0,
    },
    {
      hide: "",
      random: 0,
      columnsLength: 0,
      rowsLength: 0,
    },
  ]);

  const [boardFields, setBoardFields] = useState(
    new Array(9).fill(new Array(9).fill(0))
  );
  const [shadowBoardFields, setShadowBoardFields] = useState(boardFields);
  const prevBoardFields = useRef(boardFields);

  const [points, setPoints] = useState(0);
  const [score, setScore] = useState(0);

  const [squareSize, setSquareSize] = useState(40);
  const [squareShapeSize, setSquareShapeSize] = useState(40);

  const [count, setCount] = useState(0);

  const [soundMute, setSoundMute] = useState(true);

  //////////////// ON SHAPE OVER BOARD //////////////////////////////////////

  function onShapeOverBoard(indices, index, value) {
    let newBoard = JSON.parse(JSON.stringify(boardFields));
    let { random } = shapesInfo[index];

    const columns = SHAPES[random][0].length;
    const rows = SHAPES[random].length;

    let indexI = parseInt(indices[0]);
    let indexJ = parseInt(indices[1]);
    let shapePoints = 0;

    if (indexI + (rows - 1) > 8 || indexJ + (columns - 1) > 8) {
      setShadowBoardFields(boardFields);
      return;
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        shapePoints += SHAPES[random][i][j];
        if (
          newBoard[indexI + i][indexJ + j] === 1 &&
          SHAPES[random][i][j] === 1
        ) {
          setShadowBoardFields(boardFields);
          return;
        }
        newBoard[indexI + i][indexJ + j] =
          SHAPES[random][i][j] !== 0 ? value : newBoard[indexI + i][indexJ + j];
      }
    }

    if (value === 1) {
      let { fields, sum } = checkBoard(newBoard, 0);
      newBoard = fields;

      if (sum === 0) {
        playSound(click);
        setPoints(0);
        setScore((score) => score + shapePoints);
      } else {
        sum = Math.floor(sum * 10 + points / 2 + shapePoints);
        setPoints(sum);
        setScore((score) => score + sum);

        let soundEffect =
          sum < 15 ? soundOne : sum < 20 ? soundTwo : soundThree;
        playSound(soundEffect);
      }

      setBoardFields(newBoard);
      shapesInfo[index].hide = "hidden";
      setCount((count) => count + 1);
    } else {
      newBoard = checkBoard(newBoard, 3).fields;
      prevBoardFields.current = newBoard;
    }

    setShadowBoardFields(newBoard);
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////// USE EFFECT /////////////////////////////////////////////////

  useEffect(() => {
    const windowWidth = window.innerWidth;
    let squareWidth = squareSize;
    let shapeWidth = squareShapeSize;

    if (windowWidth < 600) {
      squareWidth = (windowWidth - 60) / 9;
      shapeWidth = (windowWidth - 60) / 15;

      setSquareSize(squareWidth);
      setSquareShapeSize(shapeWidth);
    }

    document.documentElement.style.setProperty(
      "--square-size",
      `${squareWidth}px`
    );

    document.documentElement.style.setProperty(
      "--square-shape-size",
      `${shapeWidth}px`
    );

    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    setShapesInfo(pickShapes());
  }, []);

  useEffect(() => {
    if (count % 3 === 0) {
      setShapesInfo(pickShapes());
    }
  }, [count]);

  useEffect(() => {
    if ((count + 1) % 3 === 0) {
      return;
    }

    let game = isGameOver(boardFields, shapesInfo);
    if (game) {
      onGameOver();
    }
  }, [boardFields]);

  useEffect(() => {
    let game = isGameOver(boardFields, shapesInfo);
    if (game) {
      onGameOver();
    }
  }, [shapesInfo]);

  useEffect(() => {
    onChangePoints();
  }, [points]);

  /////////////////////////////////////////////////////////////////////////////////////////

  const onChangePoints = () => {
    const span = document.querySelector("#points");
    if (points !== 0) {
      span.style.display = "flex";

      setTimeout(() => {
        span.style.fontSize = "80px";
      }, 0);

      setTimeout(() => {
        span.style.display = "none";
      }, 1000);

      setTimeout(() => {
        span.style.fontSize = "30px";
      }, 1500);
    }
  };

  const onGameOver = () => {
    const span = document.querySelector("#game_over");
    const gameOverDisplay = document.querySelector(".game_over-display");
    const box = document.querySelector(".game_over-box");

    playSound(gameOverSound);

    box.style.display = "flex";

    setTimeout(() => {
      span.style.fontSize = "60px";
    }, 0);

    gameOverDisplay.style.display = "block";
  };

  const reset = () => {
    setCount(0);

    setBoardFields(new Array(9).fill(new Array(9).fill(0)));
    setShadowBoardFields(boardFields);
    prevBoardFields.current = boardFields;

    setShapesInfo(pickShapes());

    setPoints(0);
    setScore(0);
    document.querySelector(".game_over-display").style.display = "none";
    document.querySelector(".game_over-box").style.display = "none";
  };

  const playSound = (soundEffect) => {
    if (!soundMute) {
      let sound = new Howl({
        src: soundEffect,
      });
      sound.play();
    }
  };

  const onSoundClick = (e) => {
    const soundIcon = e.currentTarget;

    if (soundMute) {
      soundIcon.classList.remove("sound-mute");
      setSoundMute(false);
    } else {
      soundIcon.classList.add("sound-mute");
      setSoundMute(true);
    }
  };

  return (
    <div className="flexbox">
      <p className="score">Score: {score}</p>
      <Board
        points={points}
        boardFields={boardFields}
        prevBoardFields={prevBoardFields}
        shadowBoardFields={shadowBoardFields}
        reset={reset}
      />

      <Shapes
        shapesInfo={shapesInfo}
        boardFields={boardFields}
        setShadowBoardFields={setShadowBoardFields}
        squareShapeSize={squareShapeSize}
        squareSize={squareSize}
        onShapeOverBoard={onShapeOverBoard}
        soundMute={soundMute}
      />

      <div className="game_over-display"></div>

      <div className="sound-container">
        <div className="sound sound-mute" onClick={onSoundClick}>
          <div className="sound--icon fa fa-volume-off"></div>
          <div className="sound--wave sound--wave_one"></div>
          <div className="sound--wave sound--wave_two"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
