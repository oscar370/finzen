import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { DescriptionRow } from "./description-row";

const meta: Meta<typeof DescriptionRow> = {
  component: DescriptionRow,
};

export default meta;
type Story = StoryObj<typeof DescriptionRow>;

export const Default: Story = {
  render: () => {
    return (
      <DescriptionRow label="Something">
        Description of something
      </DescriptionRow>
    );
  },
};
