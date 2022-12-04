import { describe, expect, it } from "vitest";
import { MockRuntime } from "./mock/runtime";
import {
	closeWindow,
	completeProcess,
	createWindow,
	executeAction,
	initialState,
	reducer,
	registerProcess,
	setWindowKey,
	setWindowState,
} from "./state";

describe("state", () => {
	describe("slice", () => {
		describe("setWindowKey", () => {
			it("sets the key", () => {
				const key = "key";
				const state = reducer(initialState, setWindowKey(key));
				expect(state.key).toBe(key);
			});
		});
		describe("createWindow", () => {
			it("should add a widnow to state", () => {
				const key = "key";
				const state = reducer(initialState, createWindow({ key }));
				const win = state.windows[key];
				expect(win).toBeDefined();
				expect(win?.state).toBe("creating");
				expect(win?.processCount).toBe(0);
			});
		});
		describe("setWindowState", () => {
			it("should set the state of a window", () => {
				const key = "key";
				const state = reducer(
					reducer(initialState, createWindow({ key })),
					setWindowState("closed", key)
				);
				const win = state.windows[key];
				expect(win).toBeDefined();
				expect(win?.state).toBe("closed");
			});
		});
		describe("closeWindow", () => {
			it("should set the state of a window to closing", () => {
				const key = "key";
				const state = reducer(
					reducer(initialState, createWindow({ key })),
					closeWindow(key)
				);
				const win = state.windows[key];
				expect(win).toBeDefined();
				expect(win?.state).toBe("closed");
			});
		});
		describe("registerProcess", () => {
			it("should increment the process count", () => {
				const key = "key";
				const state = reducer(
					reducer(initialState, createWindow({ key })),
					registerProcess(key)
				);
				const win = state.windows[key];
				expect(win).toBeDefined();
				expect(win?.processCount).toBe(1);
			});
		});
		describe("completeProcess", () => {
			it("should decrement the process count", () => {
				const key = "key";
				const preState = reducer(
					reducer(reducer(initialState, createWindow({ key })), registerProcess(key)),
					registerProcess(key)
				);
				const state = reducer(preState, completeProcess(key));
				const win = state.windows[key];
				expect(win).toBeDefined();
				expect(win?.processCount).toBe(1);
			});
			it("should close the window if the process count is 0", () => {
				const key = "key";
				const preState = reducer(
					reducer(reducer(initialState, createWindow({ key })), registerProcess(key)),
					registerProcess(key)
				);
				const state = reducer(
					reducer(reducer(preState, closeWindow(key)), completeProcess(key)),
					completeProcess(key)
				);
				const win = state.windows[key];
				expect(win).toBeDefined();
				expect(win?.state).toBe("closed");
			});
		});
	});
	describe("executeAction", () => {
		describe("createWindow", () => {
			it("should create a window with the givne props", () => {
				const runtime = new MockRuntime(false);
				executeAction(runtime, createWindow({ key: "key" }), { drift: initialState });
				expect(runtime.hasCreated.length).toBe(1);
			});
			it("should focus the window if it already exists", () => {
				const runtime = new MockRuntime(false);
				executeAction(runtime, createWindow({ key: "key" }), { drift: initialState });
				executeAction(runtime, createWindow({ key: "key" }), { drift: initialState });
				expect(runtime.hasFocused.length).toBe(1);
			});
		});
		describe("closeWindow", () => {
			it("should close the window if it has a proces count of 0", () => {
				const runtime = new MockRuntime(false);
				const state = reducer(initialState, createWindow({ key: "key" }));
				executeAction(runtime, closeWindow("key"), { drift: state });
				expect(runtime.hasClosed.length).toBe(1);
			});
			it("should not close the window if it has a process count of 1", () => {
				const runtime = new MockRuntime(false);
				const state = reducer(
					reducer(initialState, createWindow({ key: "key" })),
					registerProcess("key")
				);
				executeAction(runtime, closeWindow("key"), { drift: state });
				expect(runtime.hasClosed.length).toBe(0);
			});
		});
		describe("completeProcess", () => {
			it("should close the window if it has a process count of 1 and is in closing state", () => {
				const runtime = new MockRuntime(false);
				const state = reducer(
					reducer(
						reducer(initialState, createWindow({ key: "key" })),
						registerProcess("key")
					),
					closeWindow("key")
				);
				executeAction(runtime, completeProcess("key"), { drift: state });
				expect(runtime.hasClosed.length).toBe(1);
			});
			it("should not close the window if it has a process count of 2", () => {
				const runtime = new MockRuntime(false);
				const state = reducer(
					reducer(
						reducer(
							reducer(initialState, createWindow({ key: "key" })),
							registerProcess("key")
						),
						registerProcess("key")
					),
					closeWindow("key")
				);
				executeAction(runtime, completeProcess("key"), { drift: state });
				expect(runtime.hasClosed.length).toBe(0);
			});
		});
	});
});