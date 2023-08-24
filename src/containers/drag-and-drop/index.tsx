import React, { useState, useRef, createContext } from "react";
import { IDragAndDrop, IDragAndDropContext } from "./types";
import DraggableElement from "./draggable-element";

export const DragAndDropContext = createContext<IDragAndDropContext>({} as IDragAndDropContext);

// @ts-ignore
const DragAndDrop: IDragAndDrop = ({ children, setItems},) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const elementsMapping = useRef(new Map<HTMLDivElement, number>());


  return (
    <DragAndDropContext.Provider
      //@ts-ignore
      value={{ isDragging, setIsDragging, dropZoneRef, elementsMapping, setItems }}
    >
      {children(dropZoneRef)}
    </DragAndDropContext.Provider>
  );
};

DragAndDrop.DraggableElement = DraggableElement;
export default DragAndDrop;