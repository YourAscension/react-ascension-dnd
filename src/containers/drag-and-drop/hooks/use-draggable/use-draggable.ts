import {
  createProjection,
  swapElementToProjectionNew
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

  let projection: HTMLDivElement;
  let foundElement: void | Element;
  let elementToSwap: void | Element;

  let startX: number, startY: number;


  const dragStartHandler = (event: PointerEvent) => {
    if (draggableRef.current === null || dropZoneRef.current === null) {
      return;
    }
    setIsDragging(true);

    const { clientX, clientY } = event;
    const { height, width, top, left } = draggableRef.current.getBoundingClientRect();

    /** Вычисляем первоначальные координаты translateX и translateY элемента в документе
     * https://doka.guide/js/element-positioning-js/ */
    const style = window.getComputedStyle(draggableRef.current);
    const transform = new DOMMatrixReadOnly(style.transform);
    const translateX = transform.m41;
    const translateY = transform.m42;

    startX = clientX + translateX;
    startY = clientY + translateY;

    /** Создаём проекцию на основе спек оригинала, добавляем проекцию
     * ДО изменения позиционирования оригинала, чтобы не происходил ненужный скролл */
    projection = createProjection({ height, width });
    dropZoneRef.current.insertBefore(projection, draggableRef.current);


    /** Помещаем элемент на то же самое место, что из без absolute. absolute необходим,
     * для того, чтобы элемент был вне потока.
     * т.к. position стал absolute, то для top и left нужно задать координаты относительно ДОКУМЕНТА
     * https://learn.javascript.ru/coordinates#getCoords*/
    draggableRef.current.style.position = "fixed";
    draggableRef.current.style.top = `${top}px`;
    draggableRef.current.style.left = `${left}px`;
    draggableRef.current.style.width = `${width}px`
    draggableRef.current.style.height = `${height}px`



    document.addEventListener("pointermove", dragMoveHandler);
    document.addEventListener("pointerup", dragEndHandler);

    // window.addEventListener("wheel", dragScrollHandler);
    // /**Завершать DND когда покидаем документ и когда открываем контекстное меню*/
    document.addEventListener("mouseleave", dragEndHandler);
    document.addEventListener("contextmenu", dragEndHandler);

  };

  const dragScrollHandler = (event: any) => {
    if (draggableRef.current === null) {
      return;
    }

    draggableRef.current.hidden = true;

    foundElement = swapElementToProjectionNew(event, projection, dropZoneRef, elementsMapping);

    if (foundElement) {
      elementToSwap = foundElement;
    }

    draggableRef.current.hidden = false;
  };

  const dragMoveHandler = (event: PointerEvent) => {
    if (draggableRef.current === null) {
      return;
    }

    const x = event.clientX - startX;
    const y = event.clientY - startY;

    draggableRef.current.style.transform = `translate(${x}px, ${y}px)`;


    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = draggableRef.current.getBoundingClientRect();

    if (rect.right > viewportWidth) {
      // Элемент выходит за правый край вьюпорта, прокручиваем вправо
      window.scrollBy(rect.right - viewportWidth, 0);
    } else if (rect.left < 0) {
      // Элемент выходит за левый край вьюпорта, прокручиваем влево
      window.scrollBy(rect.left, 0);
    }
    if (rect.bottom > viewportHeight) {
      // Элемент выходит за нижний край вьюпорта, прокручиваем вниз
      window.scrollBy(0, rect.bottom - viewportHeight);
    } else if (rect.top < 0 && window.scrollY > 0) {
      // Элемент выходит за верхний край вьюпорта, прокручиваем вверх
      window.scrollBy(0, rect.top);
    }

    /**TODO Попробовать добавить все элементы и их координаты расположения в контекст,
     *  на основе координат определять над каким элементом  находится курсор и его смещать
     */
    draggableRef.current.hidden = true;
    const node = document.elementFromPoint(event.clientX, event.clientY)

    if (node !== null && node.hasAttribute('data-dropzone')) {
      console.log(node)
    }
    else {
      console.clear()
    }


    foundElement = swapElementToProjectionNew(event, projection, dropZoneRef, elementsMapping);

    if (foundElement) {
      elementToSwap = foundElement;
    }

    draggableRef.current.hidden = false;


  };

  const dragEndHandler = () => {
    if (draggableRef.current === null || dropZoneRef.current === null) {
      return;
    }

    //TODO: попробовать сделать анимации
    // const { top, left } = projection.getBoundingClientRect();

    // draggableRef.current.style.transition = "all 0.3s ease-out";
    // draggableRef.current.style.transform = "translate(0px, 0px)";
    // draggableRef.current.style.top = `${top + window.scrollY}px`;
    // draggableRef.current.style.left = `${left + window.scrollX}px`;


    // setTimeout(() => {
    projection.remove();

    if (elementToSwap) {
      const elementToSwapId = elementsMapping.current.get(elementToSwap);

      if (elementToSwapId !== undefined) {
        onSwapElement(draggingElementId, elementToSwapId);
      }
    }

    // /**Фикс бага. Если не обнулить после предыдущего элемента и ещё раз на него нажать, то он
    //  * будет меняться местом с соседним. Это ненормальное поведение.*/
    foundElement = undefined;
    elementToSwap = undefined;
    draggableRef.current.removeAttribute("style");
    setIsDragging(false);


    document.removeEventListener("pointermove", dragMoveHandler);
    document.removeEventListener("pointerup", dragEndHandler);
    document.removeEventListener("mouseleave", dragEndHandler);
    document.removeEventListener("contextmenu", dragEndHandler);


  };

  return dragStartHandler;
};

export default useDraggable;
