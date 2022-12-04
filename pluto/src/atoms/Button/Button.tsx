import { ButtonHTMLAttributes, ReactElement } from "react";
import "./Button.css";
import { ComponentSizeTypographyLevels, Text } from "@/atoms/Typography";
import clsx from "clsx";
import { ComponentSize } from "@/util";

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "filled" | "outlined" | "text";
	size?: ComponentSize;
}

export interface ButtonProps extends BaseButtonProps {
	children: string | number;
	startIcon?: ReactElement | ReactElement[];
	endIcon?: ReactElement | ReactElement[];
}

export const Button = ({
	size = "medium",
	variant = "filled",
	className,
	startIcon,
	endIcon,
	children,
	...props
}: ButtonProps) => {
	return (
		<button
			className={clsx(
				"pluto-btn",
				"pluto-btn--" + variant,
				"pluto-btn--" + size,
				className
			)}
			{...props}
		>
			<Text.WithIcon
				color={variant == "filled" ? "var(--pluto-white)" : "var(--pluto-text-color)"}
				level={ComponentSizeTypographyLevels[size]}
				startIcon={startIcon}
				endIcon={endIcon}
			>
				{children}
			</Text.WithIcon>
		</button>
	);
};