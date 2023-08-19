import React from "react";

export interface IDraggableElementProps {
  children: (draggableRef: React.RefObject<HTMLDivElement>) => React.ReactNode,
  id: number
}