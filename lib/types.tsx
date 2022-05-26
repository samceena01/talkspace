import React, { MouseEvent } from "react";

export type commonJSXChildrenType = {
  children: JSX.Element;
};

export interface BoardCanvasType {
  color: string;
  setColor: (color: string) => void;
}
