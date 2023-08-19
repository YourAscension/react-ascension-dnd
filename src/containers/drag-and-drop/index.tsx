import React, { useState, useRef, createContext } from "react";
import { IDropZoneContext, IDropZoneFCType } from "./types";
import DraggableElement from "./draggable-element";

export const DropZoneContext = createContext<IDropZoneContext | null>(null);

const DropZone: IDropZoneFCType = ({ children }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dropZoneRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  return (
    <DropZoneContext.Provider
      value={{ isDragging, setIsDragging, dropZoneRef }}
    >
      {children(dropZoneRef)}
    </DropZoneContext.Provider>
  );
};

DropZone.DraggableElement = DraggableElement;
export default DropZone;