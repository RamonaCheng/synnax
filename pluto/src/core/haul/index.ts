// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import {
  HaulProvider,
  useHaulDrag,
  useHaulDrop,
  useHaulDraggingRef,
  useHaulDraggingState,
} from "@/core/haul/HaulContext";
export type {
  Hauled,
  UseHaulDragProps,
  UseHaulDragReturn,
  UseHaulDropProps,
  UseHaulDropReturn,
} from "@/core/haul/HaulContext";

/**
 * Haul implements drag and drop functionality.
 *
 */
export const Haul = {
  /**
   * Provides drag and drop functionality to all of its children, and should typically
   * be placed as a top level component in the application.
   */
  Provider: HaulProvider,
  /**
   *
   */
  useDrop: useHaulDrop,
  useDrag: useHaulDrag,
  dragging: {
    useRef: useHaulDraggingRef,
    useState: useHaulDraggingState,
  },
};
