import { MutableRefObject, RefObject } from "react";

export type CoordinatesType = Record<string, number>
export type CoordinatesHandlerType = (coordinates: CoordinatesType) => CoordinatesType
export type ApplyDraggableStylesType = (coordinates: CoordinatesType, draggableRef: RefObject<HTMLDivElement>) => void
export type CreateProjectionType = (sizes: Record<string, number>) => HTMLDivElement

export type SwapElementToProjectionType = (coordinates: Record<string, number>,
                                           projection: HTMLDivElement,
                                           dropZoneRef: MutableRefObject<HTMLDivElement | null>) => void | Element



