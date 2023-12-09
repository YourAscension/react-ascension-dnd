import {
  ApplyDraggableStylesType,
  CoordinatesHandlerType,
  CreateProjectionType,
  SwapElementToProjectionType
} from "./types";

export const calculateShifts: CoordinatesHandlerType = (coordinates) => {
  const { clientX, clientY, elementX, elementY } = coordinates;

  return {
    startShiftX: clientX - elementX,
    startShiftY: clientY - elementY
  };
};

export const calculateCurrentCoords: CoordinatesHandlerType = (coordinates) =>{
  const { pageX, pageY, startShiftX, startShiftY } = coordinates;

  let translatedX = pageX - startShiftX;
  let translatedY = pageY - startShiftY;

  return {
    elementCurrentX: translatedX > 0 ? translatedX : 0,
    elementCurrentY: translatedY > 0 ? translatedY : 0
  }
}

export const applyDraggableStyles: ApplyDraggableStylesType = (coordinates,
                                                               draggableRef) => {
  if (draggableRef.current === null) {
    return;
  }

  const {elementCurrentX, elementCurrentY } = coordinates;
  const { height, width } = draggableRef.current.getBoundingClientRect();

  draggableRef.current.style.position = "absolute";
  draggableRef.current.style.top = 0 + "px";
  draggableRef.current.style.left = 0 + "px";
  draggableRef.current.style.height = height + "px";
  draggableRef.current.style.width = width + "px";
  draggableRef.current.style.transform = `translate(${elementCurrentX}px, ${elementCurrentY}px)`;
  draggableRef.current.style.cursor = "grabbing";
};

export const createProjection: CreateProjectionType = ({ height, width }) => {
  const projection = document.createElement("div");

  projection.classList.add("projection");
  projection.style.height = height.toString() + "px";
  projection.style.minWidth = width.toString() + "px";
  projection.style.maxWidth = width.toString() + "px";

  return projection;
};

export const swapElementToProjection: SwapElementToProjectionType = (coordinates,
                                                                     projection,
                                                                     dropZoneRef,
                                                                     elementsMapping) => {
  if (dropZoneRef.current === null) {
    return;
  }

  const { pointerX, pointerY } = coordinates;
  let { left: projectionX, top: projectionY } = projection.getBoundingClientRect();

  projectionX = projectionX + window.pageXOffset;
  projectionY = projectionY + window.pageYOffset;

  let nodeBelowPointer = document.elementFromPoint(pointerX, pointerY);

  if (!nodeBelowPointer) {
    return;
  }
  /*Чтобы найти родительский контейнер**/
  nodeBelowPointer = nodeBelowPointer.closest(".item");

  if (!nodeBelowPointer || elementsMapping.current.get(nodeBelowPointer) === undefined) {
    return;
  }

  let { left: nodeX, top: nodeY } = nodeBelowPointer.getBoundingClientRect();

  nodeX = nodeX + window.pageXOffset;
  nodeY = nodeY + window.pageYOffset;

  const scrollPosition = {
    x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  }

  if (projectionX === nodeX && projectionY > nodeY ||
    projectionY === nodeY && projectionX > nodeX) {

    dropZoneRef.current.insertBefore(projection, nodeBelowPointer);
  } else {
    dropZoneRef.current.insertBefore(projection, nodeBelowPointer.nextElementSibling);
  }

  window.scrollTo(scrollPosition.x, scrollPosition.y);

  return nodeBelowPointer;
};