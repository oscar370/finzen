import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Error } from "./error";

const meta: Meta<typeof Error> = {
  component: Error,
};

export default meta;
type Story = StoryObj<typeof Error>;

export const Default: Story = {
  render: () => {
    return <Error>Error</Error>;
  },
};
