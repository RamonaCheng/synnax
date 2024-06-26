// Copyright 2024 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { type UnaryClient, sendRequired } from "@synnaxlabs/freighter";
import { z } from "zod";

import { type Device, deviceKeyZ, deviceZ } from "@/hardware/device/payload";

const CREATE_ENDPOINT = "/hardware/device/create";
const DELETE_ENDPOINT = "/hardware/device/delete";

const createReqZ = z.object({
  devices: deviceZ.array(),
});

const createResZ = z.object({
  devices: deviceZ.array(),
});

const deleteReqZ = z.object({
  keys: deviceKeyZ.array(),
});

const deleteResZ = z.object({});

export class Writer {
  private readonly client: UnaryClient;

  constructor(client: UnaryClient) {
    this.client = client;
  }

  async create(devices: Device[]): Promise<Device[]> {
    const res = await sendRequired<typeof createReqZ, typeof createResZ>(
      this.client,
      CREATE_ENDPOINT,
      { devices },
      createReqZ,
      createResZ,
    );
    return res.devices;
  }

  async delete(keys: string[]): Promise<void> {
    await sendRequired<typeof deleteReqZ, typeof deleteResZ>(
      this.client,
      DELETE_ENDPOINT,
      { keys },
      deleteReqZ,
      deleteResZ,
    );
  }
}
