import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ListBox } from "../list-box";
import { SelectRow } from "./select-row";

const meta = {
  component: SelectRow,
} satisfies Meta<typeof SelectRow>;

export default meta;
type Story = StoryObj<typeof SelectRow>;

export const SelectRowStory: Story = {
  render: () => {
    const [select, setSelect] = useState("visible");
    return (
      <ListBox>
        <SelectRow
          title="Visibility"
          onChange={setSelect}
          options={[
            { label: "Visible", value: "visible" },
            { label: "Invisible", value: "invisible" },
          ]}
          value={select}
        />
      </ListBox>
    );
  },
};
