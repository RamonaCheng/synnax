// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { TypedWorker } from "@synnaxlabs/x";
import { ZodSchema, ZodTypeDef } from "zod";

import { WorkerMessage } from "@/core/aether/message";

export interface AetherComponent {
  type: string;
  key: string;
  setState: (path: string[], type: string, state: any) => void;
  delete: (path: string[]) => void;
}

export interface AetherFactory<C extends AetherComponent> {
  create: (type: string, key: string, state: any) => C;
}

export class AetherLeaf<EP, IP extends unknown> {
  readonly type: string;
  readonly key: string;
  readonly schema: ZodSchema<IP, ZodTypeDef, EP>;
  private stateHook?: () => void;
  private deleteHook?: () => void;
  state: IP;

  constructor(
    type: string,
    key: string,
    state: EP,
    schema: ZodSchema<IP, ZodTypeDef, EP>
  ) {
    this.type = type;
    this.key = key;
    this.state = schema.parse(state);
    this.schema = schema;
  }

  setStateHook(hook: () => void): void {
    this.stateHook = hook;
  }

  setState(path: string[], type: string, state: any): void {
    this.validatePath(path);
    this.state = this.schema.parse(state);
    this.stateHook?.();
  }

  setDeleteHook(hook: () => void): void {
    this.deleteHook = hook;
  }

  delete(path: string[]): void {
    this.validatePath(path);
    this.deleteHook?.();
  }

  private validatePath(path: string[]): void {
    if (path.length === 0)
      throw new Error(
        `[Leaf.setState] - ${this.type}:${this.key} received an empty path`
      );
    const key = path.pop() as string;
    if (path.length !== 0)
      throw new Error(
        `[Leaf.setState] - ${this.type}:${this.key} received a subPath ${path.join(
          "."
        )} but is a leaf`
      );
    if (key !== this.key)
      throw new Error(
        `[Leaf.setState] - ${this.type}:${this.key} received a key ${key} but expected ${this.key}`
      );
  }
}

export class AtherComposite<C extends AetherComponent, EP, IP extends unknown>
  extends AetherLeaf<EP, IP>
  implements AetherComponent
{
  readonly children: C[];
  readonly factory: AetherFactory<C>;

  constructor(
    type: string,
    key: string,
    factory: AetherFactory<C>,
    schema: ZodSchema<IP, ZodTypeDef, EP>,
    state: EP
  ) {
    super(type, key, state, schema);
    this.factory = factory;
    this.children = [];
  }

  setState(path: string[], type: string, state: any): void {
    const [key, subPath] = this.getRequiredKey(path);
    if (subPath.length === 0) return super.setState(path, type, state);

    const childKey = subPath[0];
    const child = this.findChild(childKey);
    if (child != null) return child?.setState(subPath, type, state);
    if (subPath.length > 1)
      throw new Error(
        `[Composite.setState] - ${this.type}:${this.key} could not find child with key ${key}:${type}`
      );
    this.children.push(this.factory.create(type, childKey, state));
  }

  delete(path: string[]): void {
    const [key, subPath] = this.getRequiredKey(path);
    if (subPath.length === 0) {
      if (key !== this.key) {
        throw new Error(
          `[Composite.delete] - ${this.type}:${this.key} received a key ${key} but expected ${this.key}`
        );
      }
      return;
    }
    const child = this.findChild(subPath[0]);
    if (child == null) {
      throw new Error(
        `[Composite.delete] - ${this.type}:${this.key} could not find child with key ${key}`
      );
    } else if (subPath.length > 1) child?.delete(subPath.slice(1));
    else this.children.splice(this.children.indexOf(child), 1);
  }

  getRequiredKey(path: string[], type?: string): [string, string[]] {
    const [key, ...subPath] = path;
    if (key == null)
      throw new Error(
        `Composite ${this.type}:${this.key} received an empty path` +
          (type != null ? ` for ${type}` : "")
      );
    return [key, subPath];
  }

  findChild<T extends C = C>(key: string): T | null {
    return (this.children.find((c) => c.key === key) ?? null) as T | null;
  }

  findChildrenOfType<T extends C = C>(key: string): T[] {
    return this.children.filter((c) => c.type === key) as T[];
  }
}

export class CompositeComponentFactory<C extends AetherComponent>
  implements AetherFactory<C>
{
  readonly factories: Record<string, AetherFactory<C>>;

  constructor(factories: Record<string, AetherFactory<C>>) {
    this.factories = factories;
  }

  create(type: string, key: string, state: any): C {
    const factory = this.factories[type];
    if (factory == null)
      throw new Error(
        `[CompositeComponentFactory.create] - Could not find factory for type ${type}`
      );
    return factory.create(key, type, state);
  }
}

export class AetherRoot<B extends unknown> {
  wrap: TypedWorker<WorkerMessage>;
  root: AetherComponent | null;
  bootstrap: (data: B) => AetherComponent;

  constructor(
    wrap: TypedWorker<WorkerMessage>,
    bootstrap: (data: B) => AetherComponent
  ) {
    this.wrap = wrap;
    this.root = null;
    this.wrap.handle((msg) => this.handle(msg));
    this.bootstrap = bootstrap;
  }

  handle(msg: WorkerMessage): void {
    if (msg.variant === "bootstrap") {
      this.root = this.bootstrap(msg.data as B);
    }
    if (this.root == null) {
      console.warn(`[BobRoot.handle] - Received message before root was set`, msg);
      return;
    }
    switch (msg.variant) {
      case "setState":
        this.root.setState(msg.path, msg.type, msg.state);
        break;
      case "delete":
        this.root.delete(msg.path);
        break;
    }
  }
}
