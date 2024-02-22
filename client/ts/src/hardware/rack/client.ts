// Copyright 2024 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { type framer } from "@/framer";
import { type NewRack, type RackPayload } from "@/hardware/rack/payload";
import { type Retriever } from "@/hardware/rack/retriever";
import { type Writer } from "@/hardware/rack/writer";
import { type NewTask, type Task } from "@/hardware/task/payload";
import { type Retriever as TaskRetriever } from "@/hardware/task/retriever";
import { type Writer as TaskWriter } from "@/hardware/task/writer";

export class Client {
  private readonly retriever: Retriever;
  private readonly writer: Writer;
  private readonly frameClient: framer.Client;
  private readonly taskWriter: TaskWriter;
  private readonly taskRetriever: TaskRetriever;

  constructor(
    retriever: Retriever,
    writer: Writer,
    frameClient: framer.Client,
    taskWriter: TaskWriter,
    taskRetriever: TaskRetriever,
  ) {
    this.retriever = retriever;
    this.writer = writer;
    this.frameClient = frameClient;
    this.taskWriter = taskWriter;
    this.taskRetriever = taskRetriever;
  }

  async create(rack: NewRack): Promise<Rack> {
    const res = await this.writer.create([rack]);
    return this.sugar(res)[0];
  }

  async retrieve(key: number): Promise<Rack> {
    const res = await this.retriever.retrieve([key]);
    return this.sugar(res)[0];
  }

  private sugar(payloads: RackPayload[]): Rack[] {
    return payloads.map(
      (payload) =>
        new Rack(payload.key, payload.name, this.taskWriter, this.taskRetriever),
    );
  }
}

export class Rack {
  key: number;
  name: string;
  private readonly writer: TaskWriter;
  private readonly retriever: TaskRetriever;

  constructor(
    key: number,
    name: string,
    _writer: TaskWriter,
    _retriever: TaskRetriever,
  ) {
    this.key = key;
    this.name = name;
    this.writer = _writer;
    this.retriever = _retriever;
  }

  async listTasks(): Promise<Task[]> {
    return await this.retriever.retrieve({ rack: this.key });
  }

  async retrieveTasks(): Promise<Task[]> {
    return [];
  }

  async createTask(task: NewTask): Promise<Task> {
    // @ts-expect-error
    task.key = (
      (BigInt(this.key) << 32n) +
      (BigInt(task.key ?? 0) & 0xffffffffn)
    ).toString();
    const res = await this.writer.create([task]);
    return res[0];
  }

  async deleteTask(task: bigint): Promise<void> {
    await this.writer.delete([task]);
  }
}