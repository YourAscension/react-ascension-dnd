import React, {FC, useContext, useRef} from 'react';
import {DropZoneContext} from "../index";
import {IDropZoneContext} from "../types";
import {IDraggableElementProps} from "./types";
import useDraggable from "../hooks/use-draggable";

const DraggableElement: FC<IDraggableElementProps> = (props) => {
    const {children, id} = props;
    const draggableRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null)

    const dropZoneContext = useContext<IDropZoneContext | null>(DropZoneContext)

    const dragStartHandler = useDraggable(dropZoneContext?.setIsDragging, dropZoneContext?.dropZoneRef, draggableRef)
    return (
        <div
            ref={draggableRef}
            className={`item ${id}`}
            onPointerDown={dragStartHandler}
        >
            {children}
        </div>
    );
};

export default DraggableElement;