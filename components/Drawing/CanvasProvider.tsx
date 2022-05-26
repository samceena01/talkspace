import { useContext, createContext, FC, useState, ReactNode } from "react";

import { BoardCanvasType } from "../../lib/types";

const BoardCanvasContext = createContext<BoardCanvasType | null>(null);

export const useCanvasContext = () => useContext(BoardCanvasContext);

interface Props {
  children: ReactNode;
}

export const CanvasProvider: FC<Props> = ({ children }) => {
  const [color, setColor] = useState("#000");

  return (
    <BoardCanvasContext.Provider
      value={{
        // resetDrawingBoard,
        color,
        setColor,
      }}
    >
      {children}
    </BoardCanvasContext.Provider>
  );
};
