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
  let elementToSwap: void | Element;

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

    document.addEventListener("pointermove", dragMoveHandler);
    document.addEventListener("pointerup", dragEndHandler);
    /**Завершать DND когда покидаем документ и когда открываем контекстное меню*/
    document.addEventListener("mouseleave", dragEndHandler);
    document.addEventListener("contextmenu", dragEndHandler);
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

    foundElement = swapElementToProjection({
      pointerX: event.clientX,
      pointerY: event.clientY
    }, projection, dropZoneRef, elementsMapping);
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
    draggableRef.current.removeAttribute("style");

    projection.remove();

    document.removeEventListener("pointermove", dragMoveHandler);
    document.removeEventListener("pointerup", dragEndHandler);
    document.removeEventListener("mouseleave", dragEndHandler);
    document.removeEventListener("contextmenu", dragEndHandler);

    if (elementToSwap) {
      const elementToSwapId = elementsMapping.current.get(elementToSwap);

      if (elementToSwapId !== undefined) {
        onSwapElement(draggingElementId, elementToSwapId);
      }
    }
    /**Фикс бага. Если не обнулить после предыдущего элемента и ещё раз на него нажать, то он
     * будет меняться местом с соседним. Это ненормальное поведение.*/
    foundElement = undefined;
    elementToSwap = undefined;

    setIsDragging(false);
  };

  return dragStartHandler;
};

export default useDraggable;
