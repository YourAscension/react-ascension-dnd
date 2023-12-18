import { DropZoneRefType, ElementsMappingRef } from "../../types";

export type CoordinatesType = Record<string, number>
export type CreateProjectionType = (sizes: Record<string, number>) => HTMLDivElement

export type SwapElementToProjectionType = (coordinates: Record<string, number>,
                                           projection: HTMLDivElement,
                                           dropZoneRef: DropZoneRefType,
                                           elementsMapping: ElementsMappingRef) => void | Element

export type SwapElementToProjectionTypeNew = (event: PointerEvent,
                                              projection: HTMLDivElement,
                                              dropZoneRef: DropZoneRefType,
                                              elementsMapping: ElementsMappingRef) => void | Element


