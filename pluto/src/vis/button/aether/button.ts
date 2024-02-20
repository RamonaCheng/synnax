// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { z } from "zod";

import { aether } from "@/aether/aether";
import { telem } from "@/telem/aether";

export const buttonStateZ = z.object({
  trigger: z.number(),
  sink: telem.booleanSinkSpecZ.optional().default(telem.noopBooleanSinkSpec),
});

interface InternalState {
  sink: telem.BooleanSink;
}

export class Button extends aether.Leaf<typeof buttonStateZ, InternalState> {
  static readonly TYPE = "Button";

  schema = buttonStateZ;

  afterUpdate(): void {
    this.internalAfterUpdate().catch(console.error);
  }

  private async internalAfterUpdate(): Promise<void> {
    const { sink: sinkProps } = this.state;
    this.internal.sink = await telem.useSink(this.ctx, sinkProps, this.internal.sink);

    if (this.state.trigger > this.prevState.trigger) {
      this.internal.sink.set(true).catch(console.error);
    }
  }

  render(): void {}

  afterDelete(): void {
    this.internalAfterDelete().catch(console.error);
  }

  private async internalAfterDelete(): Promise<void> {
    const { internal: i } = this;
    await i.sink.cleanup?.();
  }
}

export const REGISTRY: aether.ComponentRegistry = {
  [Button.TYPE]: Button,
};
