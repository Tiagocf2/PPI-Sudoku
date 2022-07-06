const useSudoku = (config = {}) => {
  const canvas = useRef();
  const sudoku = useMemo(() => new Sudoku(canvas.current, config), [config]);
  return [<canvas ref={ref} />, sudoku];
};
