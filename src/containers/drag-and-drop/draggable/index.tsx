import React, { FC, useContext, useRef, useEffect } from "react";
import { DragAndDropContext } from "../index";
import { IDraggableProps } from "./types";
import useDraggable from "../hooks/use-draggable/use-draggable";

const Draggable: FC<IDraggableProps> = (props) => {
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
    draggableRef.current.setAttribute('data-dnd', 'draggable')
    draggableRef.current.ondragstart = () => false;

    const {top, left} = draggableRef.current.getBoundingClientRect()

    elementsMapping.current.set(draggableRef.current, id);

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

export default Draggable;