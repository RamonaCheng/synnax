// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { TimeSpan, TimeStamp } from "@synnaxlabs/client";
import { Text, List, ListColumn, Menu as PMenu, Divider } from "@synnaxlabs/pluto";
import type { MenuContextItemProps } from "@synnaxlabs/pluto";
import { useDispatch } from "react-redux";

import { Menu } from "@/components";

import { setActiveRange, useSelectRanges, useSelectRange, addRange } from "../store";

import { Icon } from "@/components/Icon";

import type { Range } from "../store";

export const rangeListColumns: Array<ListColumn<Range>> = [
  {
    key: "name",
    name: "Name",
  },
  {
    key: "start",
    name: "Start",
    render: ({ entry: { start }, style }) => (
      <Text.DateTime level="p" style={style}>
        {start}
      </Text.DateTime>
    ),
  },
  {
    key: "end",
    name: "End",
    render: ({ entry: { start, end }, style }) => {
      const startTS = new TimeStamp(start);
      const endTS = new TimeStamp(end);
      return (
        <Text.DateTime
          level="p"
          style={style}
          format={endTS.span(startTS) < TimeSpan.DAY ? "time" : "dateTime"}
        >
          {endTS}
        </Text.DateTime>
      );
    },
  },
];

export interface RangesListProps {
  selectedRange?: Range | null;
  onAddOrEdit: (key?: string) => void;
  onSelect: (key: string) => void;
  onRemove: (key: string) => void;
  ranges: Range[];
}

export const RangesList = ({
  ranges,
  selectedRange,
  onAddOrEdit,
  onSelect,
  onRemove,
}: RangesListProps): JSX.Element => {
  const RangesContextMenu = ({ keys }: MenuContextItemProps): JSX.Element => {
    const handleClick = (key: string): void => {
      switch (key) {
        case "create":
          return onAddOrEdit();
        case "edit":
          return onAddOrEdit(keys[0]);
        case "remove":
          return onRemove(keys[0]);
      }
    };
    return (
      <PMenu onClick={handleClick}>
        <PMenu.Item startIcon={<Icon.Edit />} size="small" itemKey="edit">
          Edit Range
        </PMenu.Item>
        <PMenu.Item startIcon={<Icon.Delete />} size="small" itemKey="remove">
          Remove Range
        </PMenu.Item>
        <PMenu.Item startIcon={<Icon.Add />} size="small" itemKey="create">
          Create Range
        </PMenu.Item>
        <Divider direction="x" padded />
        <Menu.Item.HardReload />
      </PMenu>
    );
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <PMenu.Context menu={(props) => <RangesContextMenu {...props} />}>
        <List data={ranges}>
          <List.Selector
            value={selectedRange == null ? [] : [selectedRange.key]}
            onChange={([key]: readonly string[]) => onSelect(key)}
            allowMultiple={false}
          />
          <List.Column.Header columns={rangeListColumns} />
          <List.Core.Virtual
            itemHeight={30}
            style={{ height: "100%", overflowX: "hidden" }}
          >
            {List.Column.Item}
          </List.Core.Virtual>
        </List>
      </PMenu.Context>
    </div>
  );
};
