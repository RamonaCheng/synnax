// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { ReactElement, useCallback, useState } from "react";

import clsx from "clsx";

import { Resize, ResizeProps } from "@/core/Resize";

import { NavbarProps } from "./Navbar";

import { locToDir } from "@/spatial";

import { NavMenuItem } from "./NavMenu";

import "./Navdrawer.css";

export interface NavDrawerContent {
  key: string;
  content: ReactElement;
  minSize?: number;
  maxSize?: number;
  initialSize?: number;
}

export interface NavDrawerItem extends NavDrawerContent, NavMenuItem {}

export interface UseNavDrawerProps {
  initialKey?: string;
  items: NavDrawerItem[];
}

export interface UseNavDrawerReturn {
  activeItem?: NavDrawerContent;
  menuItems?: NavMenuItem[];
  onSelect?: (key: string) => void;
}

export interface NavDrawerProps
  extends Omit<NavbarProps, "onSelect" | "onResize">,
    UseNavDrawerReturn,
    Partial<Pick<ResizeProps, "onResize" | "collapseThreshold">> {}

export const useNavDrawer = ({
  items,
  initialKey,
}: UseNavDrawerProps): UseNavDrawerReturn => {
  const [activeKey, setActiveKey] = useState<string | undefined>(initialKey);
  const handleSelect = (key: string): void =>
    setActiveKey(key === activeKey ? undefined : key);
  const activeItem = items.find((item) => item.key === activeKey);
  return { onSelect: handleSelect, activeItem };
};

export const Navdrawer = ({
  activeItem,
  children,
  onSelect,
  location = "left",
  collapseThreshold = 0.65,
  className,

  ...props
}: NavDrawerProps): JSX.Element | null => {
  if (activeItem == null) return null;
  const dir = locToDir(location);
  const { key, content, ...rest } = activeItem;
  const handleCollapse = useCallback(() => onSelect?.(key), [onSelect, key]);
  return (
    <Resize
      className={clsx(
        "pluto-navdrawer__content",
        `pluto-navdrawer__content--${dir}`,
        className
      )}
      collapseThreshold={collapseThreshold}
      onCollapse={handleCollapse}
      location={location}
      {...rest}
      {...props}
    >
      {content}
    </Resize>
  );
};