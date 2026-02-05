import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntrySearch } from "./entry-search";

const meta = {
  component: EntrySearch,
} satisfies Meta<typeof EntrySearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EntrySearchStory: Story = {
  args: {
    placeholder: "Search anything",
  },
};
