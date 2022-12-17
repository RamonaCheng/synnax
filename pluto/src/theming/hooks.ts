import { TypographyLevel } from "../atoms";

import { useThemeContext } from "./ThemeContext";

export const useFont = (level: TypographyLevel): string => {
  const {
    theme: { typography },
  } = useThemeContext();
  const { weight, size } = typography[level];
  return `${weight} ${typography.family} ${size}rem`;
};
