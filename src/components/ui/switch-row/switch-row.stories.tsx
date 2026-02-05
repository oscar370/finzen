import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ListBox } from "../list-box";
import { SwitchRow } from "./switch-row";

const meta = {
  component: SwitchRow,
} satisfies Meta<typeof SwitchRow>;

export default meta;
type Story = StoryObj<typeof SwitchRow>;

export const SwitchRowStory: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);

    return (
      <>
        <ListBox>
          <SwitchRow
            title="Dark Mode"
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
          />
        </ListBox>
      </>
    );
  },
};
