// Copyright 2023 Synnax Labs, Inc.
//
// Use of this software is governed by the Business Source License included in the file
// licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with the Business Source
// License, use of this software will be governed by the Apache License, Version 2.0,
// included in the file licenses/APL.txt.

import reactLogo from './assets/react.svg';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { incremented, StoreState } from './store';
import { createWindow, useSelectWindow } from '@synnaxlabs/drift';

function App() {
  const count = useSelector((state: StoreState) => state.counter.value);
  const { windows } = useSelector(({ drift }: StoreState) => drift);
  const dispatch = useDispatch();
  const numOpen = Object.values(windows).filter(
    ({stage}) => stage === 'created'
  ).length;
  const w = useSelectWindow()
  console.log(w)
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            dispatch(incremented());
          }}
        >
          count is {count}
        </button>
        <button
          onClick={() => {
            dispatch(
              createWindow({
                key: `window-${numOpen}`,
                title: `Window ${numOpen}`,
                url: '/',
              })
            );
          }}
        >
          {numOpen} windows created, {numOpen} open open
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
