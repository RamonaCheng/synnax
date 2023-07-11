// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import { PropsWithChildren, ReactElement } from "react";

import { Instrumentation } from "@synnaxlabs/alamos";

import { Client, ClientProviderProps } from "@/client";
import {
  Alamos,
  Aether,
  Haul,
  ThemeProviderProps,
  Theming,
  Triggers,
  Worker,
} from "@/core";
import { TelemProvider } from "@/telem/TelemProvider/TelemProvider";

export interface PlutoProps
  extends PropsWithChildren,
    Partial<ThemeProviderProps>,
    ClientProviderProps {
  workerEnabled?: boolean;
  workerURL?: URL;
  instrumentation?: Instrumentation;
}

export const Pluto = ({
  children,
  connParams,
  workerEnabled = true,
  workerURL,
  theme,
  toggleTheme,
  setTheme,
  instrumentation,
}: PlutoProps): ReactElement => {
  const defaultWorkerURL = new URL("defaultWorker.ts", import.meta.url);
  return (
    <Alamos.Provider instrumentation={instrumentation}>
      <Theming.Provider theme={theme} toggleTheme={toggleTheme} setTheme={setTheme}>
        <Triggers.Provider>
          <Haul.Provider>
            <Worker.Provider
              url={workerURL ?? defaultWorkerURL}
              enabled={workerEnabled}
            >
              <Aether.Provider workerKey="vis">
                <Client.Provider connParams={connParams}>
                  <TelemProvider>{children}</TelemProvider>
                </Client.Provider>
              </Aether.Provider>
            </Worker.Provider>
          </Haul.Provider>
        </Triggers.Provider>
      </Theming.Provider>
    </Alamos.Provider>
  );
};
