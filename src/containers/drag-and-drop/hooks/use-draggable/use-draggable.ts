import { applyDraggableStyles, calculateShifts, createProjection, swapElementToProjection, swapItems } from "./helpers";
import React, { useContext } from "react";
import { DragAndDropContext } from "../../index";

const useDraggable = (draggableRef: React.RefObject<HTMLDivElement>, id: number) => {
  const {
    isDragging,
    setIsDragging,
    dropZoneRef,
    elementsMapping,
    //@ts-ignore
    setItems
  } = useContext(DragAndDropContext);

  let shiftX: number, shiftY: number;
  let projection: HTMLDivElement;
  let elementSwapped: void | Element;
  let currentElement: Element;

  const dragStartHandler = (event: PointerEvent) => {
    if (draggableRef.current === null || dropZoneRef.current === null){
      return
    }

    const { clientX, clientY, pageX, pageY } = event;

    setIsDragging(true);

    const { left: elementX, top: elementY, height, width } = draggableRef.current.getBoundingClientRect();

    ({ shiftX, shiftY } = calculateShifts({ clientX, clientY, elementX, elementY }));

    applyDraggableStyles({ pageX, pageY, shiftX, shiftY }, draggableRef);

    projection = createProjection({ height, width });

    dropZoneRef.current.insertBefore(projection, draggableRef.current);

    dropZoneRef.current?.addEventListener("pointermove", dragMoveHandler);
    dropZoneRef.current?.addEventListener("pointerup", dragEndHandler);
  };

  const dragMoveHandler = (event: PointerEvent) => {
    if (draggableRef.current === null){
      return
    }

    const { pageX, pageY } = event;

    applyDraggableStyles({ pageX, pageY, shiftX, shiftY }, draggableRef);
    /**TODO Попробовать добавить все элементы и их координаты расположения в контекст,
     *  на основе координат определять над каким элементом  находится курсор и его смещать
     */
    draggableRef.current.hidden = true;
    elementSwapped = swapElementToProjection({ pointerX: event.pageX, pointerY: event.pageY }, projection, dropZoneRef);
    if (elementSwapped){
      currentElement = elementSwapped
    }
    draggableRef.current.hidden = false;
  };

  const dragEndHandler = () => {
    if (draggableRef.current === null || dropZoneRef.current === null){
      return
    }

    dropZoneRef.current.insertBefore(draggableRef.current, projection);
    draggableRef.current.setAttribute("style", "");

    projection.remove();

    dropZoneRef.current.removeEventListener("pointermove", dragMoveHandler);
    dropZoneRef.current.removeEventListener("pointerup", dragEndHandler);

    if (currentElement){
      // console.log(elementsMapping.current.get(currentElement))
      const currentId = elementsMapping.current.get(currentElement);
      console.log(currentId, id)
      console.log(setItems)
      //@ts-ignore
       setItems((prev)=>swapItems(id, currentId, prev))
    }

    setIsDragging(false);
  };

  return dragStartHandler;
};

export default useDraggable;
