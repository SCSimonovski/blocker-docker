import React, { useState, useEffect } from "react";

import Shape from "./Shape";

import "../App.css";

const Shapes = ({
  shapesInfo,
  boardFields,
  setShadowBoardFields,
  squareShapeSize,
  squareSize,
  soundMute,
  onShapeOverBoard,
}) => {
  const [renderShapes, setRenderShapes] = useState([]);

  //////////////////////////////// USE EFFECT ///////////////////////////////

  useEffect(() => {
    renderShapesFunc();
  }, [shapesInfo, boardFields, soundMute]);

  ///////////////////////////////////////////////////////////////////////////
  /////////////////////////////// RENDER SHAPES FUNCTION ////////////////////

  const renderShapesFunc = () => {
    const renderShapesArr = [];

    shapesInfo.forEach((shape, index) => {
      renderShapesArr.push(
        <Shape
          key={index}
          index={index}
          random={shape.random}
          rows={shape.rowsLength}
          columns={shape.columnsLength}
          hide={shape.hide}
          squareShapeSize={squareShapeSize}
          squareSize={squareSize}
          onShapeOverBoard={onShapeOverBoard}
          boardFields={boardFields}
          setShadowBoardFields={setShadowBoardFields}
        />
      );
    });

    setRenderShapes(renderShapesArr);
  };

  ///////////////////////////////////////////////////////////////////

  let width = `${
    squareShapeSize *
      (shapesInfo[0].columnsLength +
        shapesInfo[1].columnsLength +
        shapesInfo[2].columnsLength) +
    120
  }px`;

  let height = squareShapeSize * 5;

  return (
    <div
      className="shapes"
      style={{
        width,
        height,
      }}
    >
      {renderShapes}
    </div>
  );
};

export default Shapes;
