// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { ReactElement, useState } from "react";

import type { Meta, StoryFn } from "@storybook/react";
import { ChannelKey } from "@synnaxlabs/client";

import { ChannelSelectMultiple } from "./ChannelSelect";

const story: Meta<typeof ChannelSelectMultiple> = {
  title: "Channel/Select",
  component: ChannelSelectMultiple,
};

export const Primary = (): ReactElement => {
  const [value, setValue] = useState<readonly ChannelKey[]>([]);
  return <ChannelSelectMultiple value={value} onChange={setValue} />;
};

// eslint-disable-next-line import/no-default-export
export default story;
