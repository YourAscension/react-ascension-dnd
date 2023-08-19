import { MutableRefObject, RefObject } from "react";

export type UseDraggableType = (setIsDragging: ((isDragging: boolean) => void),
                                dropZoneRef: MutableRefObject<HTMLDivElement | null>,
                                draggableRef: RefObject<HTMLDivElement>) => PointerDownActionType | void

export type CoordinatesType = Record<string, number>
export type CoordinatesHandlerType = (coordinates: CoordinatesType) => CoordinatesType
export type ApplyDraggableStylesType = (coordinates: CoordinatesType, draggableRef: RefObject<HTMLDivElement>) => void
export type CreateProjectionType = (sizes: Record<string, number>) => HTMLDivElement

export type PointerDownActionType = (event: PointerEvent) => void

export type DragStartHandlerType = (event: PointerEvent,
                                    setIsDragging: (isDragging: boolean) => void,
                                    dropZoneRef: MutableRefObject<HTMLDivElement | null>,
                                    draggableRef: RefObject<HTMLDivElement>) => void

export type PointerMoveActionType = (event: PointerEvent) => void

export type DragMoveHandlerType = (event: PointerEvent,
                                   dropZoneRef: MutableRefObject<HTMLDivElement | null>,
                                   draggableRef: MutableRefObject<HTMLDivElement>) => void

export type SwapElementToProjectionType = (coordinates: Record<string, number>,
                                           projection: HTMLDivElement,
                                           dropZoneRef: MutableRefObject<HTMLDivElement | null>) => void

export type DragEndHandlerType = (setIsDragging: (isDragging: boolean) => void,
                                  dropZoneRef: MutableRefObject<HTMLDivElement | null>,
                                  draggableRef: RefObject<HTMLDivElement>) => void

export type PointerUpActionType = () => void