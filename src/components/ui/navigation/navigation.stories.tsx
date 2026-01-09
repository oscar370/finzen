import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Navigation } from "./navigation";

const meta: Meta<typeof Navigation> = {
  component: Navigation,
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <Navigation to="somewhere">To somewhere</Navigation>
      </MemoryRouter>
    );
  },
};
