import React from 'react';
import 'styles.css';

const MobileKeyboard = ({ sudoku, showAways = false, ...props }) => {
    let isMobile =
      /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const generateButtons = () => {
      const buttons = [];
      for (let i = 1; i <= 9; i++) {
        buttons.push(
          <button
            className="sudoku-mobile-kb-button"
            onPointerUp={() => {
              sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
              sudoku.inputNumber(i);
            }}
          >
            {i}
          </button>
        );
      }
      buttons.push(
        <button
          className="sudoku-mobile-kb-button sudoku-mobile-kb-delete"
          onPointerUp={() => {
            sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
            sudoku.inputNumber(null);
          }}
        >
          &#x2421;
        </button>
      );
      return buttons;
    };
  
    return (
      <div
        role="keyboard"
        {...props}
        className={`sudoku-mobile-kb${
          props.className ? " " + props.className : ""
        }`}
      >
        {!(isMobile || showAways) && generateButtons()}
      </div>
    );
  };

  export default MobileKeyboard;