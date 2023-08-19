import { MutableRefObject, RefObject } from "react";

export type UseDraggableType = (setIsDragging: ((isDragging: boolean) => void) | undefined,
                                dropZoneRef: MutableRefObject<HTMLDivElement | null> | undefined,
                                draggableRef: RefObject<HTMLLIElement>) => (event: PointerEvent) => void

export type CoordinatesType = Record<string, number>
export type CoordinatesHandlerType<T> = (coordinates: CoordinatesType) => T
export type DraggableStylesType = Record<string, string>
export type CreateProjectionType = (sizes: Record<string, number>) => HTMLDivElement