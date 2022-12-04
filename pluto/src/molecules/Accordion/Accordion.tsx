import { ButtonIconOnlyProps, Header, Resize } from "@/atoms";
import { Direction } from "@/util";
import { ReactElement } from "react";
import { AiFillCaretDown, AiFillCaretRight } from "react-icons/ai";
import { Space } from "../../atoms/Space";

export interface AccordionEntry {
	key: string;
	title: string;
	content: ReactElement;
	actions?: (ButtonIconOnlyProps | ReactElement)[];
}

export interface AccordionProps {
	entries: AccordionEntry[];
	direction: Direction;
}

export const Accordion = ({ direction, entries }: AccordionProps) => {
	const { setSize, sizes, ...resizeProps } = Resize.useMultiple({
		direction,
		itemCount: entries.length,
		minSize: 28,
	});

	const onExpand = (index: number) => {
		if (sizes[index] < 40) {
			setSize(index, undefined, 200);
		} else {
			setSize(index, undefined, 28);
		}
	};

	return (
		<Resize.Multiple
			empty
			style={{ height: "100%" }}
			sizes={sizes}
			setSize={setSize}
			{...resizeProps}
		>
			{entries.map((entry, i) => (
				<AccordionEntryC
					{...entry}
					direction={direction}
					onExpand={onExpand}
					index={i}
					size={sizes[i]}
				/>
			))}
		</Resize.Multiple>
	);
};

interface AccordionEntryCProps extends Omit<AccordionEntry, "key"> {
	index: number;
	direction: Direction;
	size: number;
	onExpand: (i: number) => void;
}

const AccordionEntryC = ({
	index,
	title,
	content,
	direction,
	actions,
	onExpand,
	size,
}: AccordionEntryCProps) => {
	const expanded = size > 28;
	return (
		<Space direction={direction} empty style={{ height: "100%" }}>
			<Header.Button
				level="p"
				icon={expanded ? <AiFillCaretDown /> : <AiFillCaretRight />}
				onClick={() => onExpand(index)}
				style={{
					borderRadius: "0px",
					borderBottom: expanded ? "var(--pluto-border)" : "none",
				}}
				actions={actions}
			>
				{title}
			</Header.Button>
			{content}
		</Space>
	);
};