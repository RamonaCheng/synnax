// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import type { SynnaxProps } from "@synnaxlabs/client";

/** Represents the properties and state of a synnax cluster */
export interface Cluster {
  /** The unique key generated by the cluster on provisioning */
  key: string;
  /** The name of the cluster as defined by the user */
  name: string;
  /** The connection parameters for connecting to the cluster. NOTE: This contains
   * sensitive information and should be treated with care. */
  props: SynnaxProps;
}

/** A subset of Cluster that satisfies RenderableRecord */
export type RenderableCluster = Omit<Cluster, "props" | "state">;