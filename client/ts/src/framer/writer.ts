// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

/* eslint-disable @typescript-eslint/no-throw-literal */
import type { Stream, StreamClient } from "@synnaxlabs/freighter";
import { decodeError, errorZ } from "@synnaxlabs/freighter";
import {
  TimeStamp,
  type CrudeTimeStamp,
  toArray,
  type CrudeSeries,
} from "@synnaxlabs/x";
import { z } from "zod";

import {
  type KeysOrNames,
  type Key,
  type KeyOrName,
  type Params,
} from "@/channel/payload";
import { type Retriever } from "@/channel/retriever";
import { Authority } from "@/control/authority";
import {
  subjectZ as controlSubjectZ,
  type Subject as ControlSubject,
} from "@/control/state";
import { WriteFrameAdapter } from "@/framer/adapter";
import { frameZ, type CrudeFrame } from "@/framer/frame";
import { StreamProxy } from "@/framer/streamProxy";

enum Command {
  Open = 0,
  Write = 1,
  Commit = 2,
  Error = 3,
  SetAuthority = 4,
  SetMode = 5,
}

export enum WriterMode {
  PersistStream = 1,
  PersistOnly = 2,
  StreamOnly = 3,
}

const netConfigZ = z.object({
  start: TimeStamp.z.optional(),
  controlSubject: controlSubjectZ.optional(),
  keys: z.number().array().optional(),
  authorities: Authority.z.array().optional(),
  mode: z.nativeEnum(WriterMode).optional(),
});

const reqZ = z.object({
  command: z.nativeEnum(Command),
  config: netConfigZ.optional(),
  frame: frameZ.optional(),
});

type Request = z.infer<typeof reqZ>;

const resZ = z.object({
  ack: z.boolean(),
  command: z.nativeEnum(Command),
  error: errorZ.optional().nullable(),
});

type Response = z.infer<typeof resZ>;

export interface WriterConfig {
  channels: Params;
  start?: CrudeTimeStamp;
  controlSubject?: ControlSubject;
  authorities?: Authority | Authority[];
  mode?: WriterMode;
}

/**
 * Writer is used to write telemetry to a set of channels in time order.
 * It should not be instantiated directly, and should instead be instantiated via the
 * FramerClient {@link FrameClient#openWriter}.
 *
 * The writer is a streaming protocol that is heavily optimized for performance. This
 * comes at the cost of increased complexity, and should only be used directly when
 * writing large volumes of data (such as recording telemetry from a sensor or ingesting
 * data from file). Simpler methods (such as the frame client's write method) should
 * be used for most use cases.
 *
 * The protocol is as follows:
 *
 * 1. The writer is opened with a starting timestamp and a list of channel keys. The
 * writer will fail to open if the starting timestamp overlaps with any existing telemetry
 * for any channels specified. If the writer opens successfully, the caller is then
 * free to write frames to the writer.
 *
 * 2. To write a frame, the caller can use the write method and follow the validation
 * rules described in its method's documentation. This process is asynchronous, meaning
 * that write calls may return before teh frame has been written to the cluster. This
 * also means that the writer can accumulate an error after write is called. If the writer
 * accumulates an error, all subsequent write and commit calls will return False. The
 * caller can check for errors by calling the error method, which returns the accumulated
 * error and resets the writer for future use. The caller can also check for errors by
 * closing the writer, which will throw any accumulated error.
 *
 * 3. To commit the written frames to the cluster, the caller can call the commit method.
 * Unlike write, commit is synchronous, meaning that it will not return until the frames
 * have been written to the cluster. If the writer has accumulated an error, commit will
 * return false. After the caller acknowledges the error, they can attempt to commit again.
 * Commit can be called several times throughout a writer's lifetime, and will only
 * commit the frames that have been written since the last commit.
 *
 * 4. A writer MUST be closed after use in order to prevent resource leaks. Close should
 * typically be called in a 'finally' block. If the writer has accumulated an error,
 * close will throw the error.
 */
export class Writer {
  private static readonly ENDPOINT = "/frame/write";
  private readonly stream: StreamProxy<typeof reqZ, typeof resZ>;
  private readonly adapter: WriteFrameAdapter;

  private constructor(
    stream: Stream<typeof reqZ, typeof resZ>,
    adapter: WriteFrameAdapter,
  ) {
    this.stream = new StreamProxy("Writer", stream);
    this.adapter = adapter;
  }

  static async _open(
    retriever: Retriever,
    client: StreamClient,
    {
      channels,
      start = TimeStamp.now(),
      authorities = Authority.Absolute,
      controlSubject: subject,
      mode = WriterMode.PersistStream,
    }: WriterConfig,
  ): Promise<Writer> {
    const adapter = await WriteFrameAdapter.open(retriever, channels);
    const stream = await client.stream(Writer.ENDPOINT, reqZ, resZ);
    const writer = new Writer(stream, adapter);
    await writer.execute({
      command: Command.Open,
      config: {
        start: new TimeStamp(start),
        keys: adapter.keys,
        controlSubject: subject,
        authorities: toArray(authorities),
        mode,
      },
    });
    return writer;
  }

  async write(channel: KeyOrName, data: CrudeSeries): Promise<boolean>;

  async write(channel: KeysOrNames, data: CrudeSeries[]): Promise<boolean>;

  async write(frame: CrudeFrame): Promise<boolean>;

  /**
   * Writes the given frame to the database.
   *
   * @param frame - The frame to write to the database. The frame must:
   *
   *    1. Have exactly one array for each key in the list of keys provided to the
   *    writer's open method.
   *    2. Have equal length arrays for each key.
   *    3. When writing to an index (i.e. TimeStamp) channel, the values must be
   *    monotonically increasing.
   *
   * @returns false if the writer has accumulated an error. In this case, the caller
   * should acknowledge the error by calling the error method or closing the writer.
   */
  async write(
    channelsOrData: Params | Record<KeyOrName, CrudeSeries> | CrudeFrame,
    series?: CrudeSeries | CrudeSeries[],
  ): Promise<boolean> {
    const frame = await this.adapter.adapt(channelsOrData, series);
    // @ts-expect-error - zod issues
    this.stream.send({ command: Command.Write, frame: frame.toPayload() });
    return true;
  }

  async setAuthority(value: Record<Key, Authority>): Promise<boolean> {
    const res = await this.execute({
      command: Command.SetAuthority,
      config: {
        keys: Object.keys(value).map((k) => Number(k)),
        authorities: Object.values(value),
      },
    });
    return res.ack;
  }

  async setMode(mode: WriterMode): Promise<boolean> {
    const res = await this.execute({
      command: Command.SetMode,
      config: { mode },
    });
    return res.ack;
  }

  /**
   * Commits the written frames to the database. Commit is synchronous, meaning that it
   * will not return until all frames have been commited to the database.
   *
   * @returns false if the commit failed due to an error. In this case, the caller
   * should acknowledge the error by calling the error method or closing the writer.
   * After the caller acknowledges the error, they can attempt to commit again.
   */
  async commit(): Promise<boolean> {
    if (this.errorAccumulated) return false;
    const res = await this.execute({ command: Command.Commit });
    return res.ack;
  }

  /**
   * @returns  The accumulated error, if any. This method will clear the writer's error
   * state, allowing the writer to be used again.
   */
  async error(): Promise<Error | null> {
    this.stream.send({ command: Command.Error });
    const res = await this.execute({ command: Command.Error });
    return res.error != null ? decodeError(res.error) : null;
  }

  /**
   * Closes the writer, raising any accumulated error encountered during operation.
   * A writer MUST be closed after use, and this method should probably be placed
   * in a 'finally' block.
   */
  async close(): Promise<void> {
    await this.stream.closeAndAck();
  }

  async execute(req: Request): Promise<Response> {
    // @ts-expect-error
    this.stream.send(req);
    while (true) {
      const res = await this.stream.receive();
      if (res.command === req.command) return res;
      console.warn("writer received unexpected response", res);
    }
  }

  private get errorAccumulated(): boolean {
    return this.stream.received();
  }
}
