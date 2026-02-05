import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRight, User } from "lucide-react";
import { ListBox } from "../list-box";
import { ActionRow } from "./action-row";

const meta = {
  component: ActionRow,
} satisfies Meta<typeof ActionRow>;

export default meta;
type Story = StoryObj<typeof ActionRow>;

export const ActionRowStory: Story = {
  render: () => (
    <ListBox>
      <ActionRow
        title="User account"
        subtitle="Manage your data and synchronization"
        icon={<User />}
        as="a"
        href="account"
      >
        <ChevronRight size={18} />
      </ActionRow>
    </ListBox>
  ),
};
