import {
  CoordinatesHandlerType,
  CoordinatesType,
  CreateProjectionType,
  DraggableStylesType,
  UseDraggableType
} from "./types";
import { RefObject } from "react";

const calculateShifts: CoordinatesHandlerType<CoordinatesType> = (coordinates) => {
  const { clientX, clientY, elementX, elementY } = coordinates

  const shiftX = clientX - elementX;
  const shiftY = clientY - elementY;

  return { shiftX, shiftY };
};

const createDraggableStyles: CoordinatesHandlerType<DraggableStylesType> = (coordinates) => {
  const { pageX, pageY, shiftX, shiftY } = coordinates

  const translatedX = pageX - shiftX;
  const translatedY = pageY - shiftY;

  return {
    position: "absolute",
    left: 0 + "px",
    top: 0 + "px",
    transform: `translate(${translatedX}px, ${translatedY}px)`
  };
};

const createProjection: CreateProjectionType = ({ height, width }) => {
  const projection = document.createElement("div");

  projection.classList.add("projection");
  projection.style.height = height.toString()+"px";
  projection.style.width = width.toString()+"px";

  return projection;
};

let shiftX: number, shiftY: number;

//@ts-ignore
const calculateSwap = (coordinates, projection, dropZoneRef)=>{
  //@ts-ignore
  const { pointerX, pointerY } = coordinates
  //@ts-ignore
  const nodeBelowPointer = document.elementFromPoint(pointerX, pointerY)


  //@ts-ignore
  if (!!nodeBelowPointer && nodeBelowPointer.classList.contains('item')){
    if(
      projection.getBoundingClientRect().y >
      //@ts-ignore
        nodeBelowPointer.getBoundingClientRect().y ||
        projection.getBoundingClientRect().x >
      //@ts-ignore
        nodeBelowPointer.getBoundingClientRect().x
    ) {
      dropZoneRef.current.insertBefore(
        projection,
        nodeBelowPointer
      );
    }
    else {
      dropZoneRef.current.insertBefore(
        projection,      //@ts-ignore
        nodeBelowPointer.nextElementSibling
      );
    }
  }
}
//@ts-ignore
const onDragHandler = (event: PointerEvent, dropZoneRef:RefObject<HTMLDivElement>, draggableRef: RefObject<HTMLElement>, projection) => {
  const { pageX, pageY } = event;

  if (!(draggableRef.current instanceof Element) ||
    !(dropZoneRef.current instanceof Element)) {
    return;
  }

  const draggableStyles = createDraggableStyles({ pageX, pageY, shiftX, shiftY });
  draggableRef.current.style.position = draggableStyles.position;
  draggableRef.current.style.top = draggableStyles.top;
  draggableRef.current.style.left = draggableStyles.left;
  draggableRef.current.style.transform = draggableStyles.transform;

  draggableRef.current.hidden = true;
//@ts-ignore
  calculateSwap({pointerX: event.pageX, pointerY: event.pageY}, projection, dropZoneRef)
  draggableRef.current.hidden = false;
};
//@ts-ignore
let moveAction, upAction;
//@ts-ignore
const onDragEndHandler = (setIsDragging, dropZoneRef, draggableRef, projection) => {
  dropZoneRef.current.insertBefore(draggableRef.current, projection);
  draggableRef.current.style = "";
  projection.remove();//@ts-ignore
  dropZoneRef.current.removeEventListener("pointermove", moveAction);//@ts-ignore
  dropZoneRef.current.removeEventListener("pointerup", upAction);

  setIsDragging(false);
};

const useDraggable: UseDraggableType = (setIsDragging,
                                        dropZoneRef,
                                        draggableRef) => {

  return (event) => {
    const { clientX, clientY, pageX, pageY } = event;

    if (dropZoneRef === undefined ||
      draggableRef === undefined ||
      dropZoneRef?.current === null ||
      draggableRef?.current === null ||
      setIsDragging === undefined) {
      return;
    }

    if (!(draggableRef.current instanceof Element)) {
      return;
    }

    setIsDragging(true);

    const {
      left: elementX,
      top: elementY,
      height,
      width
    } = draggableRef.current.getBoundingClientRect();

    ({ shiftX, shiftY } = calculateShifts(
      {
        clientX,
        clientY,
        elementX,
        elementY
      }
    ));

    const draggableStyles = createDraggableStyles(
      {
        pageX,
        pageY,
        shiftX,
        shiftY
      }
    );

    draggableRef.current.style.position = draggableStyles.position;
    draggableRef.current.style.top = draggableStyles.top;
    draggableRef.current.style.left = draggableStyles.left;
    draggableRef.current.style.transform = draggableStyles.transform;
    draggableRef.current.style.height = height+"px";
    draggableRef.current.style.width = width+"px";

    const projection = createProjection({ height, width });
    dropZoneRef.current.insertBefore(projection, draggableRef.current);
//@ts-ignore
    moveAction = (event) => onDragHandler(event, dropZoneRef, draggableRef, projection)
    upAction = ()=>onDragEndHandler(setIsDragging, dropZoneRef, draggableRef, projection)
    dropZoneRef.current?.addEventListener("pointermove", moveAction);
    dropZoneRef.current?.addEventListener("pointerup", upAction);
  };
};

export default useDraggable;
