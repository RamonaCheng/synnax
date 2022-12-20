import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Mosaic, Theming } from "@synnaxlabs/pluto";
import type { MosaicLeaf, Location, Theme } from "@synnaxlabs/pluto";

import { Layout } from "../types";

export interface LayoutState {
  theme: string;
  themes: Record<string, Theme>;
  layouts: Record<string, Layout>;
  mosaic: MosaicLeaf;
}

export interface LayoutStoreState {
  layout: LayoutState;
}

const initialState: LayoutState = {
  theme: "synnaxDark",
  themes: Theming.themes,
  layouts: {
    main: {
      title: "Main",
      key: "main",
      type: "main",
      location: "window",
      window: {
        navTop: false,
      },
    },
  },
  mosaic: {
    key: 1,
    tabs: [],
  },
};

export type PlaceLayoutAction = PayloadAction<Layout>;
export type RemoveLayoutAction = PayloadAction<string>;

export type SetThemeAction = PayloadAction<string>;
export type ToggleThemeAction = PayloadAction<void>;

type DeleteLayoutMosaicTabAction = PayloadAction<{ tabKey: string }>;
type MoveLayoutMosaicTabAction = PayloadAction<{
  tabKey: string;
  key: number;
  loc: Location;
}>;
type ResizeLayoutMosaicTabAction = PayloadAction<{ key: number; size: number }>;
type SelectLayoutMosaicTabAction = PayloadAction<{ tabKey: string }>;
type RenameLayoutMosaicTabAction = PayloadAction<{ tabKey: string; title: string }>;

export const {
  actions: {
    placeLayout,
    removeLayout,
    deleteLayoutMosaicTab,
    moveLayoutMosaicTab,
    selectLayoutMosaicTab,
    resizeLayoutMosaicTab,
    renameLayoutMosaicTab,
    toggleTheme,
    setTheme,
  },
  reducer: layoutReducer,
} = createSlice({
  name: "layout",
  initialState,
  reducers: {
    placeLayout: (state, { payload: layout }: PlaceLayoutAction) => {
      const { key, location, title } = layout;

      const prev = state.layouts[key];

      // If we're moving from a mosaic, remove the tab.
      if (prev != null && prev.location === "mosaic" && location !== "mosaic") {
        state.mosaic = Mosaic.removeTab(initialState.mosaic, key);
      }

      // If we're move to a mosaic, insert a tab.
      if (location === "mosaic")
        state.mosaic = Mosaic.insertTab(state.mosaic, { tabKey: key, title });

      state.layouts[key] = layout;
    },
    removeLayout: (state, { payload: contentKey }: RemoveLayoutAction) => {
      const layout = state.layouts[contentKey];
      if (layout == null) return;
      const { location } = layout;

      if (location === "mosaic")
        state.mosaic = Mosaic.removeTab(state.mosaic, contentKey);

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.layouts[contentKey];
    },
    deleteLayoutMosaicTab: (
      state,
      { payload: { tabKey } }: DeleteLayoutMosaicTabAction
    ) => {
      state.mosaic = Mosaic.removeTab(state.mosaic, tabKey);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.layouts[tabKey];
    },
    moveLayoutMosaicTab: (
      state,
      { payload: { tabKey, key, loc } }: MoveLayoutMosaicTabAction
    ) => {
      const m = Mosaic.moveTab(state.mosaic, tabKey, loc, key);
      state.mosaic = m;
    },
    selectLayoutMosaicTab: (
      state,
      { payload: { tabKey } }: SelectLayoutMosaicTabAction
    ) => {
      const mosaic = Mosaic.selectTab(state.mosaic, tabKey);
      state.mosaic = mosaic;
    },
    resizeLayoutMosaicTab: (
      state,
      { payload: { key, size } }: ResizeLayoutMosaicTabAction
    ) => {
      state.mosaic = Mosaic.resizeLeaf(state.mosaic, key, size);
    },
    renameLayoutMosaicTab: (
      state,
      { payload: { tabKey, title } }: RenameLayoutMosaicTabAction
    ) => {
      state.mosaic = Mosaic.renameTab(state.mosaic, tabKey, title);
    },
    setTheme: (state, { payload: key }: SetThemeAction) => {
      state.theme = key;
    },
    toggleTheme: (state) => {
      const keys = Object.keys(state.themes);
      const index = keys.indexOf(state.theme);
      const next = keys[(index + 1) % keys.length];
      state.theme = next;
    },
  },
});
