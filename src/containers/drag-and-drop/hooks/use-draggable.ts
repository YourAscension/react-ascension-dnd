import {
  CoordinatesHandlerType,
  CoordinatesType,
  CreateProjectionType,
  DraggableStylesType,
  UseDraggableType
} from "./types";

const calculateShifts: CoordinatesHandlerType<CoordinatesType> = ({ clientX, clientY, elementX, elementY }) => {
  const shiftX = clientX - elementX;
  const shiftY = clientY - elementY;

  return { shiftX, shiftY };
};

const createDraggableStyles: CoordinatesHandlerType<DraggableStylesType> = ({ pageX, pageY, shiftX, shiftY }) => {
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
  projection.style.height = height.toString();
  projection.style.width = width.toString();

  return projection;
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

    const { shiftX, shiftY } = calculateShifts(
      {
        clientX,
        clientY,
        elementX,
        elementY
      }
    );

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

    const projection = createProjection({ height, width });
    console.log(draggableRef.current);
    dropZoneRef.current.insertBefore(projection, draggableRef.current);
  };
};

export default useDraggable;
