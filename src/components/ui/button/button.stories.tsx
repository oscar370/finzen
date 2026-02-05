import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const ButtonStory: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button>Regular</Button>

      <Button variant="flat">Flat</Button>

      <Button variant="suggested">Suggested</Button>

      <Button variant="destructive">Destructive</Button>

      <Button disabled>Disabled</Button>

      <Button variant="pill">Pill</Button>

      <Button className="bg-[#3a944a]! text-white">Force background</Button>
    </div>
  ),
};
