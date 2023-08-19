import React, { FC } from "react";
import { IDraggableElementProps } from "./draggable-element/types";

export interface IDropZoneContext {
  isDragging: boolean,
  setIsDragging: (isDragging: boolean) => void,
  dropZoneRef: React.MutableRefObject<HTMLDivElement | null>
}

export interface IDropZoneProps {
  children: (dropZoneRef: React.MutableRefObject<HTMLDivElement | null>) => React.ReactNode,
}

export type IDropZoneFCType = FC<IDropZoneProps> & { DraggableElement: FC<IDraggableElementProps> }