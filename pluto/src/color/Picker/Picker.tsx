// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { ComponentPropsWithoutRef, ReactElement } from "react";

import { SketchPicker, ColorResult } from "react-color";

import { Crude, Color, ZERO } from "@/color/core/color";
import { CSS } from "@/css";
import { Input } from "@/input";

import "@/color/Picker/Picker.css";

export interface PickerProps
  extends Input.Control<Crude, Color>,
    Omit<ComponentPropsWithoutRef<"div">, "onChange"> {}

export const Picker = ({ value, onChange, ...props }: PickerProps): ReactElement => {
  const handleChange = (color: ColorResult): void => {
    if (color.hex === "transparent") onChange(ZERO);
    onChange(new Color(color.hex, color.rgb.a));
  };

  return (
    <SketchPicker
      className={CSS.B("color-picker")}
      color={new Color(value).hex}
      onChange={handleChange}
      presetColors={[]}
      {...props}
    />
  );
};
