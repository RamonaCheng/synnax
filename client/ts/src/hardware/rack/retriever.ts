import { type UnaryClient, sendRequired } from "@synnaxlabs/freighter";
import { z } from "zod";

import { rackKeyZ, rackZ, type RackPayload } from "@/hardware/rack/payload";

const RETRIEVE_ENDPOINT = "/hardware/rack/retrieve";

const retrieveRackReqZ = z.object({
  keys: rackKeyZ.array(),
});

const retrieveRackResZ = z.object({
  racks: rackZ.array(),
});

export class Retriever {
  private readonly client: UnaryClient;

  constructor(client: UnaryClient) {
    this.client = client;
  }

  async retrieve(keys: number[]): Promise<RackPayload[]> {
    const res = await sendRequired<typeof retrieveRackReqZ, typeof retrieveRackResZ>(
      this.client,
      RETRIEVE_ENDPOINT,
      { keys },
      retrieveRackResZ,
    );
    return res.racks;
  }
}
