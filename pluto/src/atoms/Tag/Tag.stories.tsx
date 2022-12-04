import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Tag, TagProps } from ".";

export default {
  title: "Atoms/Tag",
  component: Tag,
} as ComponentMeta<typeof Tag>;

const Template = (props: TagProps) => <Tag {...props} />;

export const Primary: ComponentStory<typeof Tag> = Template.bind({});
Primary.args = {
  children: "Tag",
  onClose: () => undefined,
  variant: "filled",
  size: "medium",
};