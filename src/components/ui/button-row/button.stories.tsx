import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox } from "../list-box";
import { ButtonRow } from "./button-row";

const meta = {
  component: ButtonRow,
} satisfies Meta<typeof ButtonRow>;

export default meta;
type Story = StoryObj<typeof ButtonRow>;

export const ButtonRowStory: Story = {
  render: () => (
    <ListBox>
      <ButtonRow>Regular</ButtonRow>
      <ButtonRow variant="suggested">Suggested</ButtonRow>
      <ButtonRow variant="destructive">Destructive</ButtonRow>
    </ListBox>
  ),
};
