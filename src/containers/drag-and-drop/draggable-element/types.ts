import React from "react";

export interface IDraggableElementProps {
  children: (draggableRef: React.RefObject<HTMLLIElement>) => React.ReactNode,
  id: number
}