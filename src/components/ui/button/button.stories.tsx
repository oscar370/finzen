import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">
        <Button>Primary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="flat">Flat</Button>
        <Button variant="nav">Navigation</Button>
        <Button variant="nav" data-active>
          Navigation active
        </Button>
        <Button variant="group">Group</Button>
      </div>
    );
  },
};
