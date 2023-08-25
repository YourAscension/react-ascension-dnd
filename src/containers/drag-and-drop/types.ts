import { FC, RefObject, MutableRefObject, ReactNode } from "react";
import { IDraggableProps } from "./draggable/types";

type SetIsDraggingType = (isDragging: boolean) => void

type OnSwapElementType = (draggingElementId: number, elementToSwapId: number) => void

export type DropZoneRefType = RefObject<HTMLDivElement>

export interface IDragAndDropContext {
  isDragging: boolean,
  setIsDragging: SetIsDraggingType,
  dropZoneRef: DropZoneRefType,
  elementsMapping: MutableRefObject<Map<Element, number>>,
  onSwapElement: OnSwapElementType
}

interface IDragAndDropProps {
  children: (dropZoneRef: DropZoneRefType) => ReactNode;
  onSwapElement: OnSwapElementType;
}

export type IDragAndDrop = FC<IDragAndDropProps> & { Draggable: FC<IDraggableProps> }