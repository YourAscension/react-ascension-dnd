import React, { FC, useContext, useRef, useEffect } from "react";
import { DropZoneContext } from "../index";
import { IDropZoneContext } from "../types";
import { IDraggableElementProps } from "./types";
import useDraggable from "../hooks/use-draggable";

const DraggableElement: FC<IDraggableElementProps> = (props) => {
  const { children, id } = props;
  const draggableRef: React.RefObject<HTMLLIElement> = useRef(null);

  const dropZoneContext = useContext<IDropZoneContext | null>(DropZoneContext);

  const dragStartHandler = useDraggable(dropZoneContext?.setIsDragging, dropZoneContext?.dropZoneRef, draggableRef);

  useEffect(() => {
    draggableRef.current?.addEventListener("pointerdown", dragStartHandler);
    draggableRef.current?.classList.add(`item`, id.toString());
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