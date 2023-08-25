import { RefObject, ReactNode } from "react";

export type DraggableRefType = RefObject<HTMLDivElement>

export interface IDraggableProps {
  children: (draggableRef: DraggableRefType) => ReactNode,
  id: number
}