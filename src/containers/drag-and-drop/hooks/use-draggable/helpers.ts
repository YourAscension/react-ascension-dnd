import {
  ApplyDraggableStylesType,
  CoordinatesHandlerType,
  CreateProjectionType,
  SwapElementToProjectionType
} from "./types";

export const calculateShifts: CoordinatesHandlerType = (coordinates) => {
  const { clientX, clientY, elementX, elementY } = coordinates;

  return {
    shiftX: clientX - elementX,
    shiftY: clientY - elementY
  };
};

export const applyDraggableStyles: ApplyDraggableStylesType = (coordinates,
                                                               draggableRef) => {
  if (draggableRef.current === null) {
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
  draggableRef.current.style.cursor = "grabbing";
};

export const createProjection: CreateProjectionType = ({ height, width }) => {
  const projection = document.createElement("div");

  projection.classList.add("projection");
  projection.style.height = height.toString() + "px";
  projection.style.width = width.toString() + "px";

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
  const { x: projectionX, y: projectionY } = projection.getBoundingClientRect();

  const nodeBelowPointer = document.elementFromPoint(pointerX, pointerY);

  if (!nodeBelowPointer || !elementsMapping.current.get(nodeBelowPointer)) {
    return;
  }

  const { x: nodeX, y: nodeY } = nodeBelowPointer.getBoundingClientRect();

  if (projectionY > nodeY || projectionX > nodeX) {
    dropZoneRef.current.insertBefore(projection, nodeBelowPointer);
  } else {
    dropZoneRef.current.insertBefore(projection, nodeBelowPointer.nextElementSibling);
  }
  return nodeBelowPointer;
};