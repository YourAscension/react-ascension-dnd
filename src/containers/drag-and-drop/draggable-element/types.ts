import { RefObject, ReactNode } from "react";

export interface IDraggableElementProps {
  children: (draggableRef: RefObject<HTMLDivElement>) => ReactNode,
  id: number
}