import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button";
import { Modal } from "./modal";

const meta = {
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Modal>;

export const ModalStory: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <main className="h-dvh w-full">
          <Button onClick={() => setIsOpen(true)}>Open modal</Button>
          <Modal title="Modal" open={isOpen} onClose={() => setIsOpen(false)}>
            <h1>Hi</h1>
          </Modal>
        </main>
      </>
    );
  },
};
