// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { FocusEventHandler, ReactElement, useEffect, useState } from "react";

import { Key, KeyedRenderableRecord } from "@synnaxlabs/x";

import { Dropdown, DropdownProps } from "@/core/std/Dropdown";
import { InputControl, Input, InputProps } from "@/core/std/Input";
import { List, ListColumn, ListProps } from "@/core/std/List";
import { SelectList } from "@/core/std/Select/SelectList";

export interface SelectProps<
  K extends Key = Key,
  E extends KeyedRenderableRecord<K, E> = KeyedRenderableRecord<K>
> extends Omit<DropdownProps, "onChange" | "visible" | "children">,
    InputControl<K>,
    Omit<ListProps<K, E>, "children"> {
  tagKey?: keyof E;
  columns?: Array<ListColumn<K, E>>;
  inputProps?: Omit<InputProps, "onChange">;
}

export const Select = <
  K extends Key = Key,
  E extends KeyedRenderableRecord<K, E> = KeyedRenderableRecord<K>
>({
  onChange,
  value,
  tagKey = "key",
  columns = [],
  data = [],
  emptyContent,
  inputProps,
  ...props
}: SelectProps<K, E>): ReactElement => {
  const { ref, visible, open, close } = Dropdown.use();

  const handleChange = ([key]: readonly K[]): void => {
    onChange(key);
    close();
  };

  return (
    <List data={data} emptyContent={emptyContent}>
      <Dropdown ref={ref} visible={visible} {...props}>
        <List.Filter>
          {({ onChange }: InputProps) => (
            <SelectInput<K, E>
              data={data}
              selected={value}
              tagKey={tagKey}
              onFocus={open}
              visible={visible}
              onChange={onChange}
              {...inputProps}
            />
          )}
        </List.Filter>
        <SelectList<K, E>
          value={[value]}
          onChange={handleChange}
          allowMultiple={false}
          columns={columns}
        />
      </Dropdown>
    </List>
  );
};

export interface SelectInputProps<K extends Key, E extends KeyedRenderableRecord<K, E>>
  extends Omit<InputProps, "value"> {
  tagKey: keyof E;
  selected: K;
  visible: boolean;
  data: E[];
  debounceSearch?: number;
}

const SelectInput = <K extends Key, E extends KeyedRenderableRecord<K, E>>({
  data,
  tagKey,
  selected,
  visible,
  onChange,
  onFocus,
  debounceSearch = 250,
  ...props
}: SelectInputProps<K, E>): ReactElement => {
  // We maintain our own value state for two reasons:
  //
  //  1. So we can avoid executing a search when the user selects an item and hides the
  //     dropdown.
  //  2. So that we can display the previous search results when the user focuses on the
  //       while still being able to clear the input value for searching.
  //
  const [value, setValue] = useState("");

  // Runs to set the value of the input to the item selected from the list.
  useEffect(() => {
    if (visible) return;
    const isZero =
      selected === null ||
      (typeof selected === "number" && selected === 0) ||
      (typeof selected === "string" && selected.length === 0);
    if (isZero) return setValue("");
    const e = data.find(({ key }) => key === selected);
    const v = e?.[tagKey] ?? selected;
    setValue?.(v.toString());
  }, [selected, data, visible, tagKey]);

  const handleChange = (v: string): void => {
    onChange(v);
    setValue(v);
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    setValue("");
    onFocus?.(e);
  };

  return (
    <Input value={value} onChange={handleChange} onFocus={handleFocus} {...props} />
  );
};
