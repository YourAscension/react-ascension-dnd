import { applyDraggableStyles, calculateShifts, createProjection, swapElementToProjection } from "./helpers";
import { useContext } from "react";
import { DragAndDropContext } from "../../index";
import { DraggableRefType } from "../../draggable/types";

const useDraggable = (draggableRef: DraggableRefType, draggingElementId: number) => {
  const {
    setIsDragging,
    dropZoneRef,
    elementsMapping,
    onSwapElement
  } = useContext(DragAndDropContext);

  let shiftX: number, shiftY: number;
  let projection: HTMLDivElement;
  let foundElement: void | Element;
  let elementToSwap: Element;

  const dragStartHandler = (event: PointerEvent) => {
    if (draggableRef.current === null || dropZoneRef.current === null) {
      return;
    }

    const { clientX, clientY, pageX, pageY } = event;

    setIsDragging(true);

    const { left: elementX, top: elementY, height, width } = draggableRef.current.getBoundingClientRect();

    ({ shiftX, shiftY } = calculateShifts({ clientX, clientY, elementX, elementY }));

    applyDraggableStyles({ pageX, pageY, shiftX, shiftY }, draggableRef);

    projection = createProjection({ height, width });

    dropZoneRef.current.insertBefore(projection, draggableRef.current);

    dropZoneRef.current.addEventListener("pointermove", dragMoveHandler);
    dropZoneRef.current.addEventListener("pointerup", dragEndHandler);
  };

  const dragMoveHandler = (event: PointerEvent) => {
    if (draggableRef.current === null) {
      return;
    }

    const { pageX, pageY } = event;

    applyDraggableStyles({ pageX, pageY, shiftX, shiftY }, draggableRef);
    /**TODO Попробовать добавить все элементы и их координаты расположения в контекст,
     *  на основе координат определять над каким элементом  находится курсор и его смещать
     */
    draggableRef.current.hidden = true;
    foundElement = swapElementToProjection({ pointerX: event.pageX, pointerY: event.pageY }, projection, dropZoneRef);
    if (foundElement) {
      elementToSwap = foundElement;
    }
    draggableRef.current.hidden = false;
  };

  const dragEndHandler = () => {
    if (draggableRef.current === null || dropZoneRef.current === null) {
      return;
    }

    dropZoneRef.current.insertBefore(draggableRef.current, projection);
    draggableRef.current.setAttribute("style", "");

    projection.remove();

    dropZoneRef.current.removeEventListener("pointermove", dragMoveHandler);
    dropZoneRef.current.removeEventListener("pointerup", dragEndHandler);

    if (elementToSwap) {
      const elementToSwapId = elementsMapping.current.get(elementToSwap);

      if (elementToSwapId !== undefined) {
        onSwapElement(draggingElementId, elementToSwapId);
      }
    }

    setIsDragging(false);
  };

  return dragStartHandler;
};

export default useDraggable;
