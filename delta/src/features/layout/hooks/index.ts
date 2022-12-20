import { Dispatch, useCallback, useEffect } from "react";

import type { AnyAction } from "@reduxjs/toolkit";
import { closeWindow, createWindow } from "@synnaxlabs/drift";
import type { ThemeProviderProps } from "@synnaxlabs/pluto";
import { appWindow } from "@tauri-apps/api/window";
import type { Theme as TauriTheme } from "@tauri-apps/api/window";
import { useDispatch } from "react-redux";

import {
  placeLayout,
  removeLayout,
  setTheme,
  toggleTheme,
  useSelectLayout,
  useSelectTheme,
} from "../store";
import { Layout } from "../types";

export interface LayoutCreatorProps {
  dispatch: Dispatch<AnyAction>;
}

export type LayoutCreator = (props: LayoutCreatorProps) => Layout;

export type LayoutPlacer = (layout: Layout | LayoutCreator) => void;

export type LayoutRemover = () => void;

export const useLayoutPlacer = (): LayoutPlacer => {
  const dispatch = useDispatch();
  return useCallback(
    (layout_: Layout | LayoutCreator) => {
      const layout = typeof layout_ === "function" ? layout_({ dispatch }) : layout_;
      const { key, location, window, title } = layout;
      dispatch(placeLayout(layout));
      if (location === "window")
        dispatch(
          createWindow({
            ...{ ...window, navTop: undefined },
            url: "/",
            key,
            title,
          })
        );
    },
    [dispatch]
  );
};

export const useLayoutRemover = (key: string): LayoutRemover => {
  const dispatch = useDispatch();
  const layout = useSelectLayout(key);
  if (layout == null) throw new Error(`layout with key ${key} does not exist`);
  return () => {
    dispatch(removeLayout(key));
    if (layout.location === "window") dispatch(closeWindow(key));
  };
};

export const useThemeProvider = (): ThemeProviderProps => {
  const theme = useSelectTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (appWindow.label !== "main") return;
    appWindow
      .theme()
      .then((theme) => dispatch(setTheme(matchThemeChange({ payload: theme }))))
      .catch(console.error);
    const unlisten = appWindow.onThemeChanged((e) => {
      dispatch(setTheme(matchThemeChange(e)));
    });
    return () => {
      unlisten.then((f) => f()).catch(console.error);
    };
  }, []);

  return {
    theme,
    setTheme: (key: string) => dispatch(setTheme(key)),
    toggleTheme: () => dispatch(toggleTheme()),
  };
};

const matchThemeChange = ({ payload: theme }: { payload: TauriTheme | null }): string =>
  theme === "dark" ? "synnaxDark" : "synnaxLight";
