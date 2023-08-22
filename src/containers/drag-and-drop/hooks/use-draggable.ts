import {
  ApplyDraggableStylesType,
  CoordinatesHandlerType,
  CreateProjectionType, DragEndHandlerType,
  DragMoveHandlerType,
  DragStartHandlerType,
  PointerDownActionType, PointerMoveActionType, PointerUpActionType, SwapElementToProjectionType,
  UseDraggableType
} from "./types";

const calculateShifts: CoordinatesHandlerType = (coordinates) => {
  const { clientX, clientY, elementX, elementY } = coordinates;

  return {
    shiftX: clientX - elementX,
    shiftY: clientY - elementY
  };
};

const applyDraggableStyles: ApplyDraggableStylesType = (coordinates,
                                                        draggableRef) => {
  if (!(draggableRef.current instanceof HTMLDivElement)) {
    return;
  }

  const { pageX, pageY, shiftX, shiftY } = coordinates;
  const { height, width } = draggableRef.current.getBoundingClientRect();

  const translatedX = pageX - shiftX;
  const translatedY = pageY - shiftY;

  draggableRef.current.style.position = "absolute";
  draggableRef.current.style.top = 0 + "px";
  draggableRef.current.style.left = 0 + "px";
  draggableRef.current.style.height = height + "px";
  draggableRef.current.style.width = width + "px";
  draggableRef.current.style.transform = `translate(${translatedX}px, ${translatedY}px)`;
  draggableRef.current.style.cursor = 'grabbing'
};

const createProjection: CreateProjectionType = ({ height, width }) => {
  const projection = document.createElement("div");

  projection.classList.add("projection");
  projection.style.height = height.toString() + "px";
  projection.style.width = width.toString() + "px";

  return projection;
};

const swapElementToProjection: SwapElementToProjectionType = (coordinates,
                                                              projection,
                                                              dropZoneRef) => {
  if ((dropZoneRef.current === null)) {
    return;
  }

  const { pointerX, pointerY } = coordinates;
  const { x: projectionX, y: projectionY } = projection.getBoundingClientRect();

  const nodeBelowPointer = document.elementFromPoint(pointerX, pointerY);

  if (!nodeBelowPointer || !nodeBelowPointer.classList.contains("item")) {
    return;
  }

  const { x: nodeX, y: nodeY } = nodeBelowPointer.getBoundingClientRect();

  if (projectionY > nodeY || projectionX > nodeX) {
    dropZoneRef.current.insertBefore(projection, nodeBelowPointer);
  } else {
    dropZoneRef.current.insertBefore(projection, nodeBelowPointer.nextElementSibling);
  }
};

const useDraggable: UseDraggableType = (setIsDragging,
                                        dropZoneRef,
                                        draggableRef) => {
  let shiftX: number, shiftY: number;
  let projection: HTMLDivElement;

  const dragStartHandler: DragStartHandlerType = (event,
                                                  setIsDragging,
                                                  dropZoneRef,
                                                  draggableRef) => {
    if (!(draggableRef.current instanceof HTMLDivElement) ||
      !(dropZoneRef.current instanceof HTMLDivElement)) {
      return;
    }

    const {
      clientX,
      clientY,
      pageX,
      pageY
    } = event;

    setIsDragging(true);

    const {
      left: elementX,
      top: elementY,
      height,
      width
    } = draggableRef.current.getBoundingClientRect();

    ({ shiftX, shiftY } = calculateShifts({ clientX, clientY, elementX, elementY }));

    applyDraggableStyles({ pageX, pageY, shiftX, shiftY }, draggableRef);

    projection = createProjection({ height, width });

    dropZoneRef.current.insertBefore(projection, draggableRef.current);

    dropZoneRef.current?.addEventListener("pointermove", pointerMoveAction);
    dropZoneRef.current?.addEventListener("pointerup", pointerUpAction);
  };

  const dragMoveHandler: DragMoveHandlerType = (event,
                                                dropZoneRef,
                                                draggableRef) => {
    const { pageX, pageY } = event;

    applyDraggableStyles({ pageX, pageY, shiftX, shiftY }, draggableRef);
    /**TODO Попробовать добавить все элементы и их координаты расположения в контекст,
     *  на основе координат определять над каким элементом  находится курсор и его смещать
     */
    draggableRef.current.hidden = true;
    swapElementToProjection({
        pointerX: event.pageX,
        pointerY: event.pageY
      },
      projection,
      dropZoneRef);
    draggableRef.current.hidden = false;
  };

  const dragEndHandler: DragEndHandlerType = (setIsDragging,
                                              dropZoneRef,
                                              draggableRef) => {
    if (dropZoneRef.current === null || draggableRef.current === null) {
      return;
    }

    dropZoneRef.current.insertBefore(draggableRef.current, projection);
    draggableRef.current.setAttribute("style", "");

    projection.remove();

    dropZoneRef.current.removeEventListener("pointermove", pointerMoveAction);
    dropZoneRef.current.removeEventListener("pointerup", pointerUpAction);

    setIsDragging(false);
  };

  const pointerDownAction: PointerDownActionType =
    (event) => dragStartHandler(event, setIsDragging, dropZoneRef, draggableRef);
  const pointerMoveAction: PointerMoveActionType =
    //@ts-ignore
    (event) => dragMoveHandler(event, dropZoneRef, draggableRef);
  const pointerUpAction: PointerUpActionType =
    () => dragEndHandler(setIsDragging, dropZoneRef, draggableRef);

  return pointerDownAction;
};

export default useDraggable;
