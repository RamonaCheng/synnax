// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { RUNTIME } from "@synnaxlabs/x";
import memoize from "proxy-memoize";

export const proxyMemo: typeof memoize = (fn, opts) => {
  if (RUNTIME === "browser") return memoize(fn, opts);
  return fn;
};