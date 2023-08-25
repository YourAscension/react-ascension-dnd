import React, { useState, useRef, createContext } from "react";
import { IDragAndDrop, IDragAndDropContext } from "./types";
import Draggable from "./draggable";

export const DragAndDropContext = createContext<IDragAndDropContext>({} as IDragAndDropContext);

const DragAndDrop: IDragAndDrop = ({ children, onSwapElement }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const elementsMapping = useRef(new Map<HTMLDivElement, number>());


  return (
    <DragAndDropContext.Provider
      value={{ isDragging, setIsDragging, dropZoneRef, elementsMapping, onSwapElement }}
    >
      {children(dropZoneRef)}
    </DragAndDropContext.Provider>
  );
};

DragAndDrop.Draggable = Draggable;
export default DragAndDrop;