import React, { FC, useContext, useRef, useEffect } from "react";
import { DragAndDropContext } from "../index";
import { IDraggableElementProps } from "./types";
import useDraggable from "../hooks/use-draggable/use-draggable";

const DraggableElement: FC<IDraggableElementProps> = (props) => {
  const { children, id } = props;
  const draggableRef = useRef<HTMLDivElement>(null);

  const { elementsMapping, dropZoneRef } = useContext(DragAndDropContext);

  const dragStartHandler = useDraggable(draggableRef, id);

  const prepareCurrentElement = () => {
    if (!draggableRef.current || !dropZoneRef.current || !dragStartHandler) {
      return;
    }

    draggableRef.current.addEventListener("pointerdown", dragStartHandler);
    // draggableRef.current.classList.add(`item`, id.toString());
    draggableRef.current.classList.add(`item`);
    draggableRef.current.ondragstart = () => false;

    elementsMapping.current.set(draggableRef.current, id);
    console.log(elementsMapping.current);
  };

  useEffect(() => {
    prepareCurrentElement();
  }, []);

  return (
    <>
      {
        children(draggableRef)
      }
    </>
  );
};

export default DraggableElement;