import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox } from "../list-box";
import { EntryRow } from "./entry-row";

const meta = {
  decorators: [
    (Story) => (
      <ListBox>
        <Story />
      </ListBox>
    ),
  ],
  component: EntryRow,
} satisfies Meta<typeof EntryRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EntryRowStory: Story = {
  args: {
    title: "User",
    placeholder: "Enter your username",
  },
};
