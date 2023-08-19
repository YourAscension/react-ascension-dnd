import React, {PointerEventHandler} from "react";

export type UseDraggableType = (setIsDragging: ((isDragging: boolean) => void) | undefined, dropZoneRef: React.MutableRefObject<HTMLDivElement | null> | undefined, draggableRef: React.MutableRefObject<HTMLDivElement | null>) => PointerEventHandler<HTMLDivElement>


export type CoordinatesType = Record<string, number>
export type CoordinatesHandlerType<T> = (coordinates: CoordinatesType) => T
export type DraggableStylesType = Record<string, string>
export type CreateProjectionType = (sizes: Record<string, number>) => HTMLDivElement