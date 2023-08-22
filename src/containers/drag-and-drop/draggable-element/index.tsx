import React, { FC, useContext, useRef, useEffect } from "react";
import { DropZoneContext } from "../index";
import { IDropZoneContext } from "../types";
import { IDraggableElementProps } from "./types";
import useDraggable from "../hooks/use-draggable";

const DraggableElement: FC<IDraggableElementProps> = (props) => {
  const { children, id } = props;
  const draggableRef: React.RefObject<HTMLDivElement> = useRef(null);

  const dropZoneContext = useContext<IDropZoneContext | null>(DropZoneContext);
  //@ts-ignore
  const dragStartHandler = useDraggable(dropZoneContext?.setIsDragging, dropZoneContext?.dropZoneRef, draggableRef);

  useEffect(() => {
    if (draggableRef.current && dragStartHandler) {
      draggableRef.current.addEventListener("pointerdown", dragStartHandler);
      draggableRef.current.classList.add(`item`, id.toString());
      draggableRef.current.draggable = false;
      draggableRef.current.ondragstart = () => false;
    }
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