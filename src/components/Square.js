import React from "react";

import "../App.css";
// import "./card.styles.css";

const Square = ({ classes, id, size }) => {
  return (
    <div
      className={`square ${classes} `}
      id={id}
      style={{ width: size, height: size }}
    />
  );
};

export default Square;
