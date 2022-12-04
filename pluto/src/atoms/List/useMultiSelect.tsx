import { useEffect } from "react";
import { useState } from "react";
import { useKeyHeld } from "@/hooks";

export interface useMultiSelectProps<E extends Record<string, unknown>> {
	data: E[];
	selected?: string[];
	selectMultiple?: boolean;
	onSelect?: (selected: string[]) => void;
}

type KeyedRecord = {
	key: string;
	[key: string]: unknown;
};

export const useMultiSelect = <E extends KeyedRecord>({
	data,
	selected: selectedProp,
	selectMultiple,
	onSelect: onSelectProp,
}: useMultiSelectProps<E>): {
	selected: string[];
	onSelect: (key: string) => void;
	clearSelected: () => void;
} => {
	const [selected, setSelected] = useState<string[]>([]);
	const [shiftSelected, setShiftSelected] = useState<string | undefined>(undefined);
	const shiftPressed = useKeyHeld("Shift");

	useEffect(() => {
		if (!shiftPressed) setShiftSelected(undefined);
	}, [shiftPressed]);

	const onSelect = (key: string) => {
		let nextSelected: string[] = [];
		if (!selectMultiple) {
			nextSelected = selected.includes(key) ? [] : [key];
		} else if (shiftPressed && shiftSelected !== undefined) {
			// We might select in reverse order, so we need to sort the indexes.
			const [start, end] = [
				data.findIndex((v) => v.key === key),
				data.findIndex((v) => v.key === shiftSelected),
			].sort((a, b) => a - b);
			const nextKeys = data.slice(start, end + 1).map(({ key }) => key);
			// We already deselect the shiftSelected key, so we don't included it
			// when checking whether to select or deselect the entire range.
			if (nextKeys.slice(1, nextKeys.length - 1).every((k) => selected.includes(k))) {
				nextSelected = selected.filter((k) => !nextKeys.includes(k));
			} else {
				nextSelected = [...selected, ...nextKeys];
			}
			setShiftSelected(undefined);
		} else {
			if (shiftPressed) setShiftSelected(key);
			if (selected.includes(key)) nextSelected = selected.filter((k) => k !== key);
			else nextSelected = [...selected, key];
		}
		nextSelected = [...new Set(nextSelected)];
		setSelected(nextSelected);
		onSelectProp?.(nextSelected);
	};

	useEffect(() => {
		if (selectedProp) setSelected(selectedProp);
	}, [selectedProp]);

	const clearSelected = () => {
		setSelected([]);
		onSelectProp?.([]);
	};
	return { selected, onSelect, clearSelected };
};