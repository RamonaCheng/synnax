import clsx from "clsx";
import { Text, TextProps } from "@/atoms/Typography";
import { StatusVariant } from "@/atoms/Status";
import "./InputHelpText.css";

export interface InputHelpTextProps extends Partial<TextProps> {
  variant?: StatusVariant;
}

export const InputHelpText = ({
  className,
  variant = "error",
  ...props
}: InputHelpTextProps) => {
  return (
    <Text
      className={clsx(
        "pluto-input-help-text",
        `pluto-input-help-text--${variant}`,
        className
      )}
      level="small"
      {...props}
    />
  );
};