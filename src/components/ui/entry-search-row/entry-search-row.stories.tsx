import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox } from "../list-box";
import { EntrySearchRow } from "./entry-search-row";

const meta = {
  component: EntrySearchRow,
} satisfies Meta<typeof EntrySearchRow>;

export default meta;
type Story = StoryObj<typeof EntrySearchRow>;

export const EntrySearchRowStory: Story = {
  render: () => (
    <ListBox>
      <EntrySearchRow placeholder="Search anything" />
    </ListBox>
  ),
};
