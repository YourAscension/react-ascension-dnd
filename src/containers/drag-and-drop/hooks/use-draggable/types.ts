import { DropZoneRefType, ElementsMappingRef } from "../../types";

export type CoordinatesType = Record<string, number>
export type CoordinatesHandlerType = (coordinates: CoordinatesType) => CoordinatesType
export type ApplyDraggableStylesType = (coordinates: CoordinatesType, draggableRef: DropZoneRefType) => void
export type CreateProjectionType = (sizes: Record<string, number>) => HTMLDivElement

export type SwapElementToProjectionType = (coordinates: Record<string, number>,
                                           projection: HTMLDivElement,
                                           dropZoneRef: DropZoneRefType,
                                           elementsMapping: ElementsMappingRef) => void | Element



