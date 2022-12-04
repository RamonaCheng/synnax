import { addons } from "@storybook/addons";
import { themes, create } from "@storybook/theming";
import { synnaxDark } from "../src/theming/theme";
import "./index.css";

const theme = create({
  ...themes.dark,
  colorPrimary: synnaxDark.colors.primary.z,
  colorSecondary: synnaxDark.colors.primary.z,
  appBg: synnaxDark.colors.background,
  appContentBg: synnaxDark.colors.background,
  appBorderColor: synnaxDark.colors.border,
  appBorderRadius: synnaxDark.sizes.border.radius as number,
  fontBase: synnaxDark.typography.family,
  brandImage:
    "https://raw.githubusercontent.com/synnaxlabs/synnax/main/docs/media/logo/title-white.png",
  brandUrl: "https://docs.synnaxlabs.com",
});

addons.setConfig({
  theme: theme,
});