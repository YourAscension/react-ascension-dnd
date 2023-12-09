import {
  applyDraggableStyles,
  calculateCurrentCoords,
  calculateShifts,
  createProjection,
  swapElementToProjection
} from "./helpers";
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

  let startShiftX: number, startShiftY: number;
  let elementCurrentX: number, elementCurrentY: number;
  let projection: HTMLDivElement;
  let foundElement: void | Element;
  let elementToSwap: void | Element;


  const dragStartHandler = (event: PointerEvent) => {
    if (draggableRef.current === null || dropZoneRef.current === null) {
      return;
    }
    setIsDragging(true);

    const { clientX, clientY, pageX, pageY } = event;
    const { left: elementX, top: elementY, height, width } = draggableRef.current.getBoundingClientRect();

    ({ startShiftX, startShiftY } = calculateShifts({ clientX, clientY, elementX, elementY }));
    ({ elementCurrentX, elementCurrentY } = calculateCurrentCoords({ pageX, pageY, startShiftX, startShiftY }));
    applyDraggableStyles({ elementCurrentX, elementCurrentY }, draggableRef);

    projection = createProjection({ height, width });
    dropZoneRef.current.insertBefore(projection, draggableRef.current);

    document.addEventListener("pointermove", dragMoveHandler);
    // document.addEventListener('wheel', dragScrollHandler)
    document.addEventListener("pointerup", dragEndHandler);
    /**Завершать DND когда покидаем документ и когда открываем контекстное меню*/
    document.addEventListener("mouseleave", dragEndHandler);
    document.addEventListener("contextmenu", dragEndHandler);
  };

  const dragScrollHandler = (event: Event) => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
//@ts-ignore
    const pageY = event.clientY + scrollY;

    ({ elementCurrentY} = calculateCurrentCoords({ pageY, startShiftX, startShiftY }));
    applyDraggableStyles({  elementCurrentX, elementCurrentY }, draggableRef);
  }

  const dragMoveHandler = (event: PointerEvent) => {
    if (draggableRef.current === null) {
      return;
    }

    const { pageX, pageY } = event;
    ({ elementCurrentX, elementCurrentY} = calculateCurrentCoords({ pageX, pageY, startShiftX, startShiftY }));
    applyDraggableStyles({  elementCurrentX, elementCurrentY }, draggableRef);


//     const viewportWidth = window.innerWidth;
//     const viewportHeight = window.innerHeight;
//     const rect = draggableRef.current.getBoundingClientRect();
//
//     if (rect.right > viewportWidth) {
//       // Элемент выходит за правый край вьюпорта, прокручиваем вправо
//       window.scrollBy(rect.right - viewportWidth, 0);
//     } else if (rect.left < 0) {
//       // Элемент выходит за левый край вьюпорта, прокручиваем влево
//       window.scrollBy(rect.left, 0);
//     }
//
//     if (rect.bottom > viewportHeight) {
// // Элемент выходит за нижний край вьюпорта, прокручиваем вниз
//       window.scrollBy(0, rect.bottom - viewportHeight);
//     } else if (rect.top < 0 && window.scrollY > 0) {
// // Элемент выходит за верхний край вьюпорта, прокручиваем вверх
//       window.scrollBy(0, rect.top);
//     }

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
