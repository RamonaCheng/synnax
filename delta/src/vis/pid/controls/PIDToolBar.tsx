// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { ReactElement, useCallback } from "react";

import { Icon } from "@synnaxlabs/media";
import { Space, Tab, Tabs } from "@synnaxlabs/pluto";

import { PIDElements } from "./PIDElements";

import { ToolbarHeader, ToolbarTitle } from "@/components";

export interface PIDToolbar {
  layoutKey: string;
}

const TABS = [
  {
    tabKey: "elements",
    name: "Elements",
  },
];

export const PIDToolbar = ({ layoutKey }: PIDToolbar): ReactElement => {
  const content = useCallback(
    ({ tabKey }: Tab): ReactElement => <PIDElements layoutKey={layoutKey} />,
    [layoutKey]
  );

  const tabsProps = Tabs.useStatic({
    tabs: TABS,
    content,
  });

  return (
    <Space empty>
      <Tabs.Provider value={tabsProps}>
        <ToolbarHeader>
          <ToolbarTitle icon={<Icon.Control />}>PID</ToolbarTitle>
          <Tabs.Selector style={{ borderBottom: "none" }} size="large" />
        </ToolbarHeader>
        <Tabs.Content />
      </Tabs.Provider>
    </Space>
  );
};
