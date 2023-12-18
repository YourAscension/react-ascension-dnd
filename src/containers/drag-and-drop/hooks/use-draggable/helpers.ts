import {
  CreateProjectionType,
  SwapElementToProjectionType,
  SwapElementToProjectionTypeNew
} from "./types";

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


  return nodeBelowPointer;
};

export const swapElementToProjectionNew: SwapElementToProjectionTypeNew = (event,
                                                                     projection,
                                                                     dropZoneRef,
                                                                     elementsMapping) => {
  if (dropZoneRef.current === null) {
    return;
  }

  const { clientX: pointerClientX, clientY: pointerClientY, pageX: pointerPageX, pageY: pointerPageY } = event

  let nodeBelowPointer = document.elementFromPoint(pointerClientX, pointerClientY);

  if (nodeBelowPointer !== null){
    nodeBelowPointer = nodeBelowPointer.closest('[data-dnd]');


    if (nodeBelowPointer !== null && elementsMapping.current.get(nodeBelowPointer) !== undefined) {
      let { left: projectionX, top: projectionY } = projection.getBoundingClientRect();
      let { left: nodeBelowPointerX, top: nodeBelowPointerY } = nodeBelowPointer.getBoundingClientRect();

      projectionX = projectionX + window.scrollX;
      projectionY = projectionY + window.scrollY;
      nodeBelowPointerX = nodeBelowPointerX + window.scrollX;
      nodeBelowPointerY = nodeBelowPointerY + window.scrollY;
      const scrollPosition = {
        x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      }

      if (projectionX === nodeBelowPointerX && projectionY > nodeBelowPointerY ||
        projectionY === projectionY && projectionX > nodeBelowPointerX) {

        dropZoneRef.current.insertBefore(projection, nodeBelowPointer);
      } else {
        dropZoneRef.current.insertBefore(projection, nodeBelowPointer.nextElementSibling);
      }

      window.scrollTo(scrollPosition.x, scrollPosition.y);

      return nodeBelowPointer
    }
  }
}