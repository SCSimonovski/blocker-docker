import React, { useState, useEffect, useRef } from "react";

import Square from "./Square";

import { SHAPES } from "../fixtures/shapes";

// import "./shape.styles.css";
import "../App.css";

const Shape = ({
  id,
  index,
  onShapeOverBoard,
  random,
  hide,
  columns,
  rows,
  squareSize,
  squareShapeSize,
  boardFields,
  setShadowBoardFields,
}) => {
  const [size, setSize] = useState(squareShapeSize);
  const [renderShape, setRenderShape] = useState([]);

  const prevIndex = useRef(0);

  useEffect(() => {
    setSize(squareShapeSize);
  }, [squareShapeSize]);

  useEffect(() => {
    renderShapeFunc();
  }, [random, size]);

  const handleTouchStart = (e) => {
    const shape = e.currentTarget;
    const div = shape.parentNode;

    const { clientX, clientY } = e.touches[0];

    let shiftX = clientX - shape.getBoundingClientRect().left;
    let shiftY = clientY - shape.getBoundingClientRect().top;

    let indices = [];

    setSize(squareSize);

    shape.classList.add("draggable");
    document.querySelector("#root").append(shape);

    const moveAt = (clientX, clientY) => {
      shape.style.left = clientX - shiftX + "px";
      shape.style.top = clientY - 120 - shiftY + "px";
    };

    moveAt(clientX, clientY);

    const onTouchMove = (e) => {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      moveAt(clientX, clientY);

      shape.style.pointerEvents = "none";

      let elemBelow = document.elementFromPoint(
        clientX - shiftX + squareSize / 2,
        clientY - 120 - shiftY + squareSize / 2
      );

      shape.style.pointerEvents = "auto";

      if (!elemBelow) return;

      indices = elemBelow.id.split("-");

      if (indices.length === 2) {
        if (JSON.stringify(prevIndex.current) !== JSON.stringify(indices)) {
          onShapeOverBoard(indices, index, 2);
        }
        prevIndex.current = indices;
      } else {
        setShadowBoardFields(boardFields);
      }
    };

    document.addEventListener("touchmove", onTouchMove, false);

    shape.ontouchend = function () {
      document.removeEventListener("touchmove", onTouchMove);

      setSize(squareShapeSize);

      if (indices.length === 2) {
        onShapeOverBoard(indices, index, 1);
      }
      shape.classList.remove("draggable");
      div.append(shape);
      shape.style.left = clientX - shiftX + "px";
      shape.style.top = clientY - shiftY + "px";

      shape.onmouseup = null;
    };
  };

  /////////////////////////////////////////////////////////////////////////
  //////////// HANDLE MOUSE DOWN ///////////////////////////////////////////

  const handleMouseDown = (e) => {
    const shape = e.currentTarget;
    const div = shape.parentNode;

    setSize(squareSize);

    const { pageX, pageY } = e;

    let shiftX = e.clientX - shape.getBoundingClientRect().left;
    let shiftY = e.clientY - shape.getBoundingClientRect().top;
    let indices = [];

    shape.classList.add("draggable");
    document.querySelector("#root").append(shape);

    const moveAt = (pageX, pageY) => {
      shape.style.left = pageX - shiftX + "px";
      shape.style.top = pageY - shiftY + "px";
    };
    moveAt(pageX, pageY);

    const onMouseMove = (e) => {
      moveAt(e.pageX, e.pageY);

      shape.style.pointerEvents = "none";

      let elemBelow = document.elementFromPoint(
        e.clientX - shiftX + squareSize / 2,
        e.clientY - shiftY + squareSize / 2
      );

      shape.style.pointerEvents = "auto";

      if (!elemBelow) return;

      indices = elemBelow.id.split("-");

      if (indices.length === 2) {
        if (JSON.stringify(prevIndex.current) !== JSON.stringify(indices)) {
          onShapeOverBoard(indices, index, 2);
        }
        prevIndex.current = indices;
      } else {
        setShadowBoardFields(boardFields);
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    shape.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      setSize(squareShapeSize);

      if (indices.length === 2) {
        onShapeOverBoard(indices, index, 1);
      }

      shape.classList.remove("draggable");
      div.append(shape);
      shape.style.left = pageX - shiftX + "px";
      shape.style.top = pageY - shiftY + "px";

      shape.onmouseup = null;
    };
  };

  ///////////// RENDER SHAPE ////////////////////////////////

  const renderShapeFunc = () => {
    const shapeInfo = SHAPES[random];
    const shapeDisplay = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let classes = !shapeInfo[i][j] && " shape-empty ";
        if (shapeInfo[i][j]) {
          if (i > 0) {
            if (shapeInfo[i - 1][j] === 0) classes += " border-top";
          } else if (i === 0) {
            classes += " border-top";
          }
          if (i < rows - 1) {
            if (shapeInfo[i + 1][j] === 0) classes += " border-bottom";
          } else if (i === rows - 1) {
            classes += " border-bottom";
          }

          if (j > 0) {
            if (shapeInfo[i][j - 1] === 0) classes += " border-left";
          } else if (j === 0) {
            classes += " border-left";
          }
          if (j < columns - 1) {
            if (shapeInfo[i][j + 1] === 0) classes += " border-right";
          } else if (j === columns - 1) {
            classes += " border-right";
          }
        }
        classes += " square-shape-size ";

        shapeDisplay.push(
          <Square key={`${i}-${j}`} classes={classes} size={size}></Square>
        );
      }
    }

    setRenderShape(shapeDisplay);
  };
  ///////////////////////////////////////////////////////////

  return (
    <div
      className="box"
      style={{
        width: columns * size,
        height: rows * size,
      }}
    >
      <div
        style={{ display: "flex" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={"shape " + hide}
        style={{
          width: columns * size,
          height: rows * size,
        }}
        id={id}
      >
        {renderShape}
      </div>
    </div>
  );
};

export default Shape;
