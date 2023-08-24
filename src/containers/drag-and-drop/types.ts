import { FC, RefObject, MutableRefObject, ReactNode } from "react";
import { IDraggableElementProps } from "./draggable-element/types";

export interface IDragAndDropContext {
  isDragging: boolean,
  setIsDragging: (isDragging: boolean) => void,
  dropZoneRef: RefObject<HTMLDivElement>,
  elementsMapping: MutableRefObject<Map<Element, number>>
}

interface IDragAndDropProps {
  children: (dropZoneRef: RefObject<HTMLDivElement>) => ReactNode;
}

export type IDragAndDrop = FC<IDragAndDropProps> & { DraggableElement: FC<IDraggableElementProps> }