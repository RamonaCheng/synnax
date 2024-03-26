// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

export * from "@/channel";
export { default as Synnax, synnaxPropsZ } from "@/client";
export type { SynnaxProps } from "@/client";
export * from "@/connection";
export { Channel } from "@/channel/client";
export {
  AuthError,
  ContiguityError,
  QueryError,
  RouteError,
  UnexpectedError,
  ValidationError,
} from "@/errors";
export { framer } from "@/framer";
export { Frame } from "@/framer/frame";
export { ontology } from "@/ontology";
export { control } from "@/control";
export { Authority } from "@/control/authority";
export {
  DataType,
  Density,
  Rate,
  Series,
  TimeRange,
  TimeSpan,
  TimeStamp,
} from "@synnaxlabs/x/telem";
export type {
  NativeTypedArray,
  CrudeDataType,
  CrudeDensity,
  CrudeRate,
  CrudeSize,
  CrudeTimeSpan,
  CrudeTimeStamp,
  SampleValue,
  TimeStampStringFormat,
  TZInfo,
} from "@synnaxlabs/x/telem";
export { workspace } from "@/workspace";
export { ranger } from "@/ranger";
export { label } from "@/label";
export { hardware } from "@/hardware";
export { rack } from "@/hardware/rack";
export { task } from "@/hardware/task";
export { device } from "@/hardware/device";
